import { Request, Response, NextFunction, Router } from 'express'
import errors from '../util/errors'

const handle404Error = (router: Router) => {
  router.use((_req: Request, _res: Response) => {
    errors.notFoundError()
  })
}

const handleClientError = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errors.clientError(err, res, next)
  })
}

const handleServerError = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errors.serverError(err, res, next)
  })
}

export default [handle404Error, handleClientError, handleServerError]