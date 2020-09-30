export type ENV = 'development' | 'staging' | 'production'

export const environment = (process.env.NODE_ENV || 'development') as ENV