import { NextFunction, Request, Response } from 'express'
import { jwtService } from '../services/auth/jwt/jwt'
import { AuthenticatedRequest } from '../types'
import { HTTP401Error } from '../util/errors/httpErrors'
import { accessTokenRepository } from '../services/auth/oauth2/accessToken'


/** Require JWT auth middleware layer */
export const jwtVerify = async (req: Request, res: Response, next: NextFunction) => {
  let accessToken
  try {
    accessToken = jwtService.getTokenFromRequest(req)
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: err.message || 'unexpected error while parsing the token' })
    return
  }

  // JWT checksum
  try {
    await accessTokenRepository.get(accessToken)
  } catch (err) {
    res.status(401).json({ message: 'invalid access token' })
    return
  }

  // throws an error if the token has expired or has a invalid signature
  const decodedToken = jwtService.verify(accessToken) as { id: string }
  if (!decodedToken) {
    throw new HTTP401Error('access_denied')
  }
  if (!decodedToken.id) {
    throw new HTTP401Error('invalid access token, no user matches this token')
  }

  const authRequest = req as AuthenticatedRequest
  authRequest.userID = decodedToken.id

  next()
}
