import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  /** user id set at the JWT token validation middleware */
  userID?: string,
}