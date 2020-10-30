export type ENV = 'development' | 'staging' | 'production' | 'test'

export const environment = (process.env.NODE_ENV) as ENV