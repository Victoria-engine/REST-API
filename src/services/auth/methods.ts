import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../../models/user'
import { HTTP401Error, HTTP404Error } from '../../util/errors/httpErrors'
import { getUserByEmail, getUserByGoogleID } from '../user/methods'

const { JWT_SECRET } = process.env

export interface LoginStrategy {
  identifier: string,
  getUser: (identifier: string) => Promise<User | null>,
  login: (credentials: LoginUserPayload) => string | Promise<string>,
}
export enum LoginStragegies {
  OAUTH2_GOOGLE = 'oauth2_google',
  INTERNAL = 'internal'
}

const InternaltLoginStrategy: LoginStrategy = {
  identifier: 'email',
  getUser: async (email: string) => await getUserByEmail(email),
  login: async (credentials) => {
    const { email, password } = credentials
    if (!password) {
      throw new Error('Internal user does not have a password, wrong login strategy.')
    }

    if (!JWT_SECRET) {
      throw new Error('No JWT Secret.')
    }

    const user = await getUserByEmail(email)
    if (!user) {
      throw new HTTP401Error('No google user found with specified ID.')
    }

    if (!user.password) {
      throw new Error('Internal user does not have a password, wrong login strategy.')
    }

    // Validate password and hashed one
    const comparePasswords = await bcrypt.compare(password, user.password)

    if (!comparePasswords) {
      throw new HTTP401Error('Wrong password.')
    }

    const accessToken = jwt.sign({ email, id: user.id.toString() },
      JWT_SECRET, {
      expiresIn: '7d',
    })

    return accessToken
  }
}

const GoogleOAuth2LoginStrategy: LoginStrategy = {
  identifier: 'google_id',
  getUser: async (id: string) => await getUserByGoogleID(id),
  login: async (credentials) => {
    const { email, google_id } = credentials

    try {
      if (!google_id) {
        throw new Error('Google user does not have a google_id, wrong login strategy.')
      }

      if (!JWT_SECRET) {
        throw new Error('No JWT Secret.')
      }

      const user = await getUserByGoogleID(google_id)
      if (!user) {
        throw new HTTP401Error('No google user found with specified ID.')
      }

      const accessToken = jwt.sign({ email, id: user.id.toString() },
        JWT_SECRET, {
        expiresIn: '7d', // TODO: Make sure google expires rate is time
      })

      return accessToken
    } catch (err) {
      throw new Error(err)
    }
  }
}

export const LoginStrategyHandler = {
  [LoginStragegies.INTERNAL]: InternaltLoginStrategy,
  [LoginStragegies.OAUTH2_GOOGLE]: GoogleOAuth2LoginStrategy,
}

export type LoginUserPayload = { email: string, password?: string, google_id?: string }
export const loginUser = async (credentials: LoginUserPayload) => {
  const { email, google_id } = credentials

  const userIdentifier = email || google_id
  if (!userIdentifier) {
    throw new HTTP404Error('Missing args.')
  }
  const getUserStrategy = google_id ? LoginStragegies.OAUTH2_GOOGLE : LoginStragegies.INTERNAL
  const strategy = LoginStrategyHandler[getUserStrategy]

  try {
    const accesToken = await strategy.login(credentials)
    return accesToken
  } catch (err) {
    throw new Error(err)
  }
}