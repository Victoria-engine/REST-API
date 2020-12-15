import bcrypt from 'bcrypt'
import { AuthStragegies, AuthStrategy, LoginUserPayload, GoogleUserData, AuthStrategyRegisterData, InternalRegisterUserData } from '../../../types'
import { HTTP401Error, HTTP404Error } from '../../../util/errors/httpErrors'
import { createUser, getUserByEmail, getUserByGoogleID } from '../../user/methods'
import { createAccessToken, createRefreshToken } from './methods'


const InternalLoginStrategy: AuthStrategy = {
  getUser: async function (email: string) {
    return await getUserByEmail(email)
  },
  register: async function ({ email, password, name }) {
    try {
      return await createUser({ email, name, password })
    } catch (err) {
      throw new Error(err)
    }
  },
  login: async function ({ email, password }) {
    const user = await this.getUser(email)

    if (!user || !user.password) {
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

const GoogleOAuth2LoginStrategy: AuthStrategy = {
  getUser: async function (id: string) {
    return await getUserByGoogleID(id)
  },
  register: async function ({ email, id, name }: GoogleUserData) {
    try {
      return await createUser({
        email, name,
        google_id: id,
      })
    } catch (err) {
      throw new Error(err)
    }
  },
  login: async function ({ email, google_id }) {
    try {
      if (!google_id) {
        throw new Error('google user does not have a google_id, wrong login strategy')
      }

      const user = await this.getUser(google_id)

      const tokenPayload = { email, id: user?.id.toString() }

      const accessToken = await createAccessToken(tokenPayload)
      const refreshToken = await createRefreshToken(tokenPayload)

      return { accessToken, refreshToken }
    } catch (err) {
      throw new Error(err)
    }
  }
}

const AuthStrategyHandler = {
  [AuthStragegies.Internal]: InternalLoginStrategy,
  [AuthStragegies.Google]: GoogleOAuth2LoginStrategy,
}

export const loginUser = async (credentials: LoginUserPayload) => {
  const { email, google_id } = credentials

  const userIdentifier = email || google_id
  if (!userIdentifier) {
    throw new HTTP404Error('missing args')
  }
  const context = google_id ? AuthStragegies.Google : AuthStragegies.Internal
  const loginStrategy = AuthStrategyHandler[context]

  return await loginStrategy.login(credentials)
}

export const registerUser = async (data: GoogleUserData | InternalRegisterUserData) => {
  const { email, id } = data as GoogleUserData

  const userIdentifier = email || id
  if (!userIdentifier) {
    throw new HTTP404Error('missing args')
  }

  const context = id ? AuthStragegies.Google : AuthStragegies.Internal
  const registerStrategy = AuthStrategyHandler[context]

  return await registerStrategy.register(data as AuthStrategyRegisterData)
}