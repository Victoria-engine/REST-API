import bcrypt from 'bcrypt'
import { LoginStragegies, LoginStrategy, LoginUserPayload } from '../../../types'
import { HTTP401Error, HTTP404Error } from '../../../util/errors/httpErrors'
import { getUserByEmail, getUserByGoogleID } from '../../user/methods'
import { createAccessToken, createRefreshToken } from './methods'


const InternalLoginStrategy: LoginStrategy = {
  identifier: 'email',
  getUser: async (email: string) => await getUserByEmail(email),
  login: async (credentials) => {
    const { email, password } = credentials

    const user = await getUserByEmail(email)

    if (!user.password) {
      throw new Error('user is not an internal, try to login with an external provider')
    }

    // Validate password against the hashed one
    const comparePasswords = await bcrypt.compare(password, user.password)
    if (!comparePasswords) {
      throw new HTTP401Error('wrong password')
    }

    const tokenPayload = { email, id: user.id.toString() }

    const accessToken = await createAccessToken(tokenPayload)
    const refreshToken = await createRefreshToken(tokenPayload)

    return { accessToken, refreshToken }
  }
}

const GoogleOAuth2LoginStrategy: LoginStrategy = {
  identifier: 'google_id',
  getUser: async (id: string) => await getUserByGoogleID(id),
  login: async (credentials) => {
    const { email, google_id } = credentials

    try {
      if (!google_id) {
        throw new Error('google user does not have a google_id, wrong login strategy')
      }

      const user = await getUserByGoogleID(google_id)

      const tokenPayload = { email, id: user.id.toString() }

      const accessToken = await createAccessToken(tokenPayload)
      const refreshToken = await createRefreshToken(tokenPayload)

      return { accessToken, refreshToken }
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
    throw new HTTP404Error('missing args')
  }
  const loginContext = google_id ? LoginStragegies.OAUTH2_GOOGLE : LoginStragegies.INTERNAL
  const loginStrategy = LoginStrategyHandler[loginContext]

  const accessTokens = await loginStrategy.login(credentials)
  return accessTokens
}