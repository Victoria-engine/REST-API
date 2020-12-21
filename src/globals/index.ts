export type ENV = 'development' | 'staging' | 'production' | 'test'

export const environment = (process.env.NODE_ENV) as ENV

export const ERRORS_MSG = {
  MISSING_AUTH: 'no authorization header or cookie, please refer to the documentation',
}

export const ACCESS_TOKEN_COOKIE_KEY = 'victoria_a_t'
export const REFRESH_TOKEN_COOKIE_KEY = 'victoria_r_t'
export const CONTENT_KEY_COOKIE_KEY = 'victoria_consumer_key'

export const ADMIN_ROUTE_PREFIX = '/admin'