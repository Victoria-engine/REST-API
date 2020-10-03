import { NextFunction, Request, Response } from 'express'
import { createUser, getAllUsers } from '../../services/users/methods'
import { present } from '../../services/users/presenters'

export default [
  {
    path: '/users',
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const users = await getAllUsers()

          const result = users.map((u) => present(u))

          res.status(200).json(result)
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: '/users',
    method: 'post',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const { email, password, name } = req.body

        try {
          const freshUser = await createUser({ email, password, name })

          res.status(200).json(freshUser)
        } catch (err) {
          res.status(409).json({
            message: `User with email ${email} already exists.`,
          })
          next(err)
        }
      },
    ],
  }
]