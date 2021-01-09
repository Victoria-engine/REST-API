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

export interface InternalRegisterUserData {
  email: string,
  password: string,
}

export type AuthStrategyRegisterData = InternalRegisterUserData & GoogleUserData

export interface AuthStrategy {
  getUser: (identifier: string) => Promise<User | null>,
  login: (credentials: LoginUserPayload) => Promise<{ accessToken: JWTToken; refreshToken: JWTToken; }>,
  register: (userData: AuthStrategyRegisterData) => Promise<User>,
}

export enum AuthStragegies {
  Google = 'oauth2_google',
  Internal = 'internal'
}

export type GoogleUserData = {
  email: string,
  name: string,
  id: string,
}

export type GoogleUserAuthSession = {
  access_token: string,
  refresh_token: string,
  id_token: string,
  token_type: 'Bearer',
  scope: string,
  expires_in: number,
}

export interface GoogleService {
  getUserData: (at: string) => Promise<GoogleUserData>,
  exchangeAccessTokenForCode: (code: string) => Promise<GoogleUserAuthSession>,

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

export enum PostVisibility {
  All = 'all',
  Public = 'public',
  NotListed = 'not-listed'
}


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

export interface CreateUserPayload {
  password?: string,
  email: string,
  name?: string,
  google_id?: string,
}

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
  created_at?: Date,
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
  created_at?: Date,
}

export const isValidVisibility = (v?: string): v is PostVisibility => {
  if (!v) return true
  return Object.values(PostVisibility).includes(v as PostVisibility)
}