import { Response, NextFunction } from 'express'
import { HTTPClientError, HTTP404Error } from './httpErrors'
import signale = require('signale')
import { environment } from '../../globals'

export const notFoundError = () => {
  throw new HTTP404Error('Method not found.')
}

export const clientError = (err: Error, res: Response, next: NextFunction) => {
  signale.error('client error', err)
  if (err instanceof HTTPClientError) {
    res.status(err.statusCode).json({ message: err.message })
  } else {
    next(err)
  }
}

export const serverError = (err: Error, res: Response, _next: NextFunction) => {
  signale.error(err)

  if (environment=== 'production') {
    res.status(500).send('Internal Server Error')
  } else {
    res.status(500).json({ message: err.stack })
  }
}

export default {
  serverError,
  clientError,
  notFoundError,
}