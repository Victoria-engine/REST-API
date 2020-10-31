import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest, JWTService } from '../types'
import { HTTP401Error } from '../util/errors/httpErrors'

export const jwtService: JWTService = {
  verify: jwt['verify'],
}

/** Require JWT auth middleware layer */
export const JWTTokenVerify = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    throw new HTTP401Error('no Authorization header')
  }


  if (!authHeader.startsWith('Bearer ')) {
    throw new HTTP401Error('missing "Bearer <token>" value from Authorization header key')
  }

  const accessToken = authHeader.split(' ')[1]
  if (!accessToken) {
    throw new HTTP401Error('missing access token in authorization headers')
  }

  const { JWT_SECRET } = process.env
  if (!JWT_SECRET) {
    throw new Error('missing JWT secret')
  }

  const decodedToken = jwtService.verify(accessToken, JWT_SECRET)
  if (!decodedToken) {
    throw new HTTP401Error('invalid access token')
  }

  const authRequest = req as AuthenticatedRequest
  authRequest.userID = decodedToken.id

  next()
}