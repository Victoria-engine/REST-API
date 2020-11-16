import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import jsonwebtoken, { SignOptions, VerifyOptions } from 'jsonwebtoken'
import { HTTP401Error } from '../../../util/errors/httpErrors'
import { JWTService } from '../../../types'
import { Request } from 'express'
import { ACCESS_TOKEN_COOKIE_KEY, ERRORS_MSG } from '../../../globals'

const privateKey = fs.readFileSync(path.join(process.cwd(), 'certificates/private.key'))
const publicKey = fs.readFileSync(path.join(process.cwd(), 'certificates/public.key'))




const sign = (payload: string | Buffer | Record<string, unknown>, options?: SignOptions) => {
  const signOptions: SignOptions = {
    ...options,
    algorithm: 'RS256',
    expiresIn: options?.expiresIn || '1d',
    issuer: options?.issuer || 'api.victoria-engine.com',
    jwtid: options?.jwtid || uuidv4()
  }

  return jsonwebtoken.sign(payload, privateKey, signOptions)
}

const verify = (token: string, options?: VerifyOptions) => {
  try {
    return jsonwebtoken.verify(token, publicKey, {
      ...options,
      algorithms: ['RS256'],
    })
  } catch (err) {
    throw new HTTP401Error('expired_token')
  }
}

const decode = (token: string) => {
  try {
    return jsonwebtoken.decode(token)
  } catch (err) {
    throw new HTTP401Error('invalid token')
  }
}

export const getTokenFromRequest = (req: Request): string => {
  const authHeader = req.get('Authorization')
  const authCookie = req.cookies && req.cookies[ACCESS_TOKEN_COOKIE_KEY]

  if (authCookie) {
    return authCookie
  }

  if (!authHeader) {
    throw new HTTP401Error(ERRORS_MSG.MISSING_AUTH)
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new HTTP401Error('missing "Bearer <token>" value from Authorization header key')
  }

  const accessToken = authHeader.split(' ')[1]
  if (!accessToken) {
    throw new HTTP401Error('missing access token in authorization headers')
  }

  return accessToken
}

export const jwtService: JWTService = {
  sign,
  verify,
  decode,
  getTokenFromRequest,
}
