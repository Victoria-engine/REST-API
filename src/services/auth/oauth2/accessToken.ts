import AccessToken from '../../../models/accessToken'
import { AccessTokenRepository, DecodedToken, SaveAccessTokenPayload } from '../../../types'
import { jwtService } from '../jwt/jwt'

const save = async ({ token, userID, expirationDate }: SaveAccessTokenPayload) => {
  const decodedToken = jwtService.decode(token) as DecodedToken
  if (!decodedToken) {
    throw new Error('error while decoding access token')
  }

  try {
    return await new AccessToken({
      token: decodedToken.jti,
      user_id: userID,
      expiration_date: expirationDate,
    }).save()
  } catch (err) {
    throw new Error(err)
  }
}

const get = async (accessToken: string) => {
  try {
    const decodedToken = jwtService.decode(accessToken) as DecodedToken

    if (!decodedToken) {
      throw new Error('error while decoding access token')
    }

    return await AccessToken.where<AccessToken>({ token: decodedToken.jti }).fetch()
  } catch (err) {
    throw new Error('unable to find access token')
  }
}

export const accessTokenRepository: AccessTokenRepository = {
  get,
  save,
}
