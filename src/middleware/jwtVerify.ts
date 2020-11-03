import { NextFunction, Request, Response } from 'express'
import { jwtService } from '../services/auth/jwt/jwt'
import { AuthenticatedRequest} from '../types'
import { HTTP401Error } from '../util/errors/httpErrors'


/** Require JWT auth middleware layer */
export const jwtVerify = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = jwtService.getTokenFromRequest(req)

  // throws an error if the token has expired or has a invalid signature
  const decodedToken = jwtService.verify(accessToken) as { id: string }
  if (!decodedToken) {
    throw new HTTP401Error('invalid access token')
  }

  const authRequest = req as AuthenticatedRequest
  authRequest.userID = decodedToken.id

  next()
}
