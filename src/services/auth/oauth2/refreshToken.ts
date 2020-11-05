import RefreshToken from '../../../models/refreshToken'
import { RefreshTokenRepository } from '../../../types'
import { jwtService } from '../jwt/jwt'


export type SaveRefreshTokenPayload = { token: string, userID: string, expirationDate: Date }
const save = async ({ token, userID, expirationDate }: SaveRefreshTokenPayload) => {
  const decodedToken = jwtService.decode(token) as { jti: string } | null
  if (!decodedToken) {
    throw new Error('error while decoding refresh token')
  }

  try {
    return await new RefreshToken({
      token: decodedToken.jti,
      user_id: userID,
      expiration_date: expirationDate,
    }).save()
  } catch (err) {
    throw new Error(err)
  }
}

const get = async (refreshToken: string) => {
  try {
    const decodedToken = jwtService.decode(refreshToken) as { jti: string } | null

    if (!decodedToken) {
      throw new Error('error while decoding refresh token')
    }

    return await RefreshToken.where<RefreshToken>({ token: decodedToken.jti }).fetch()
  } catch (err) {
    throw new Error('unable to find refresh token')
  }
}


export const refreshTokenRepository: RefreshTokenRepository = {
  get,
  save,
}