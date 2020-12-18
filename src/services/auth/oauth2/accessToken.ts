import AccessToken from '../../../models/accessToken'
import { AccessTokenRepository, DecodedToken, SaveAccessTokenPayload } from '../../../types'
import { HTTP401Error } from '../../../util/errors/httpErrors'
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
    throw new HTTP401Error(err)
  }
}

const get = async (accessToken: string) => {
  try {
    const decodedToken = jwtService.decode(accessToken) as DecodedToken

    if (!decodedToken) {
      throw new Error('error while decoding access token')
    }

    const t = await AccessToken.where<AccessToken>({ token: decodedToken.jti }).fetch()
    return t
  } catch (err) {
    throw new HTTP401Error('invalid access token')
  }
}

export const accessTokenRepository: AccessTokenRepository = {
  get,
  save,
}
