import { NextFunction, Request, Response } from 'express'
import { jwtService } from '../services/auth/jwt/jwt'
import { AuthenticatedRequest } from '../types'
import { HTTP401Error } from '../util/errors/httpErrors'
import { accessTokenRepository } from '../services/auth/oauth2/accessToken'


/** Require JWT auth middleware layer */
const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = jwtService.getTokenFromRequest(req)

    // JWT checksum
    await accessTokenRepository.get(accessToken)

    // throws an error if the token has expired or has a invalid signature
    const decodedToken = await jwtService.verify(accessToken) as { id: string }
    if (!decodedToken) {
      throw new HTTP401Error('access_denied')
    }
    if (!decodedToken.id) {
      throw new HTTP401Error('invalid access token, no user matches this token')
    }

    const authRequest = req as AuthenticatedRequest
    authRequest.userID = decodedToken.id

    next()
  } catch (err) {
    next(err)
  }
}

export default verifyJWT