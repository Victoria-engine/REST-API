export type ENV = 'development' | 'staging' | 'production' | 'test'

export const environment = (process.env.NODE_ENV) as ENV

export const ACCESS_TOKEN_COOKIE_KEY = 'victoria_a_t'
export const REFRESH_TOKEN_COOKIE_KEY = 'victoria_r_t'