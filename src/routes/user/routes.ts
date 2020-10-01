import { NextFunction, Request, Response, } from 'express'
import User from '../../models/user'

export default [
  {
    path: '/users',
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const users = await new User().fetchAll()

          res.status(200).json(users)
        } catch (err) {
          next(err)
        }
      },
    ],
  },
]