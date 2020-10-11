import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest } from '../types'
import { HTTP401Error } from '../util/errors/httpErrors'

/** Require JWT auth middleware layer */
export const JWTTokenVerify = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    throw new HTTP401Error('No Authorization header.')
  }


  if (!authHeader.startsWith('Bearer ')) {
    throw new HTTP401Error('Missing "Bearer <token>" value from Authorization header key.')
  }

  const accessToken = authHeader.split(' ')[1]
  if (!accessToken) {
    throw new HTTP401Error('Missing access token in authorization headers.')
  }

  const { JWT_SECRET } = process.env
  if (!JWT_SECRET) {
    throw new Error('Missing JWT secret')
  }

  const decodedToken = jwt.verify(accessToken, JWT_SECRET) as any
  if (!decodedToken) {
    throw new HTTP401Error('Invalid access token.')
  }

  const authRequest = req as AuthenticatedRequest
  authRequest.userID = decodedToken.id

  next()
}