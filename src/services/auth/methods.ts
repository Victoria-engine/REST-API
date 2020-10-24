import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { LoginStragegies, LoginStrategy, LoginUserPayload } from '../../types'
import { HTTP401Error, HTTP404Error } from '../../util/errors/httpErrors'
import { getUserByEmail, getUserByGoogleID } from '../user/methods'

const { JWT_SECRET } = process.env


const InternalLoginStrategy: LoginStrategy = {
  identifier: 'email',
  getUser: async (email: string) => await getUserByEmail(email),
  login: async (credentials) => {
    const { email, password } = credentials

    if (!JWT_SECRET) {
      throw new Error('No JWT Secret.')
    }

    const user = await getUserByEmail(email)

    if (!user.password) {
      throw new Error('User is not an internal, try to login with an external provider.')
    }

    // Validate password against the hashed one
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

const LoginStrategyHandler = {
  [LoginStragegies.INTERNAL]: InternalLoginStrategy,
  [LoginStragegies.OAUTH2_GOOGLE]: GoogleOAuth2LoginStrategy,
}

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