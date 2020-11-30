import { Request } from 'express'
import { SignOptions, VerifyOptions } from 'jsonwebtoken'
import AccessToken from './models/accessToken'
import RefreshToken from './models/refreshToken'
import User from './models/user'

export interface AuthenticatedRequest extends Request {
  /** user id set at the JWT token validation middleware */
  userID?: string,
}

export type LoginUserPayload = { email: string, password?: string, google_id?: string }
export type JWTToken = { token: string, expiresIn: number }

export interface LoginStrategy {
  identifier: string,
  getUser: (identifier: string) => Promise<User | null>,
  login: (credentials: LoginUserPayload) => Promise<{ accessToken: JWTToken; refreshToken: JWTToken; }>,
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

export interface JWTService {
  decode: (token: string) => string | { [key: string]: any; } | null
  sign: (payload: string | Buffer | Record<string, unknown>, options?: SignOptions) => string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  verify: (token: string, options?: VerifyOptions | undefined) => string | object
  getTokenFromRequest: (request: Request) => string,
}

export type ValidationParam = {
  param_key: string,
  required: boolean,
  type: string,
  validator_functions?: ((param: any) => boolean)[]
}

export type PostVisibility = 'public' | 'not-listed' | 'private'

export type DecodedToken = {
  id: string,
  email: string,
  jti: string
}

export type SaveAccessTokenPayload = { token: string, userID: string, expirationDate: Date }

export interface AccessTokenRepository {
  get: (accessToken: string) => Promise<AccessToken>
  save: (payload: SaveAccessTokenPayload) => Promise<AccessToken>
}

export interface RefreshTokenRepository {
  get: (refrshToken: string) => Promise<RefreshToken>
  save: (payload: SaveAccessTokenPayload) => Promise<RefreshToken>
}

export type CreateUserPayload = { password?: string, email: string, name: string, google_id?: string }
export type UpdateUserPayload = {
  password?: string | null,
  email?: string | null,
  name?: string | null,
  blog_id?: string | null,
}

export type CreateBlogPayload = { title: string, description: string, consumer_key_id: number }
export type UpdateBlogPayload = {
  title?: string | null,
  description?: string | null,
}

export interface BasePost {
  title: string,
  text: string,
  visibility: PostVisibility,
  description?: string,
}


export interface CreatePostPayload extends BasePost {
  user_id: string,
  blog_id: string,
}

export interface UpdatePostPayload {
  title?: string,
  text?: string,
  visibility?: PostVisibility,
  description?: string,
}
