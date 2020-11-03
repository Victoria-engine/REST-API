import { JWTToken } from '../../../types'
import { jwtService } from '../jwt/jwt'
import refreshTokenMethods from './refreshToken'

const { REFRESH_TOKEN_LIFE, ACCESS_TOKEN_LIFE } = process.env

type CreateTokenPayload = { email: string, id: string }
export const createRefreshToken = async ({ email, id }: CreateTokenPayload) => {
  try {
    const accessTokenPayload = { email, id: id.toString() }
    const expiresIn = Number(REFRESH_TOKEN_LIFE)

    const refreshToken = jwtService.sign(
      accessTokenPayload,
      { expiresIn, subject: id.toString() },
    )

    // Store the resfresh token
    await refreshTokenMethods.save({
      token: refreshToken,
      userID: id,
      expirationDate: new Date(Date.now() + (expiresIn * 1000)),
    })

    return { token: refreshToken, expiresIn }
  } catch (err) {
    throw new Error(err)
  }
}

export const createAccessToken = async ({ email, id }: CreateTokenPayload) => {
  try {
    const accessTokenPayload = { email, id: id.toString() }
    const expiresIn = Number(ACCESS_TOKEN_LIFE)

    const accessToken = jwtService.sign(
      accessTokenPayload,
      {
        expiresIn,
        subject: id.toString()
      },
    )

    // TODO: Store the access token ?

    return { token: accessToken, expiresIn }
  } catch (err) {
    throw new Error(err)
  }
}

export const getTokenExpirationDate = (token: JWTToken): Date => {
  return new Date(Date.now() + (token.expiresIn * 1000))
}