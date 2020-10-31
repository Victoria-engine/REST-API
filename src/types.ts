import { Request } from 'express'
import User from './models/user'

export interface AuthenticatedRequest extends Request {
  /** user id set at the JWT token validation middleware */
  userID?: string,
}

export type LoginUserPayload = { email: string, password?: string, google_id?: string }

export interface LoginStrategy {
  identifier: string,
  getUser: (identifier: string) => Promise<User | null>,
  login: (credentials: LoginUserPayload) => string | Promise<string>,
}
export enum LoginStragegies {
  OAUTH2_GOOGLE = 'oauth2_google',
  INTERNAL = 'internal'
}

export type GoogleUserData = {
  email: string,
  name: string,
  id: string,
}

export interface GoogleService {
  getUserData: (at: string) => Promise<GoogleUserData>
}