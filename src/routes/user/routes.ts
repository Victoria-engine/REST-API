import { NextFunction, Response } from 'express'
import { presentUser } from '../../services/user/presenters'
import { getUserByID } from '../../services/user/methods'
import { AuthenticatedRequest } from '../../types'
import { verifyJWT } from '../../middleware'

export default [
  {
    path: '/user',
    method: 'get',
    handler: [
      verifyJWT,

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userID = '' } = req
        try {
          const user = await getUserByID(userID)

          res.status(200).json(presentUser(user))
        } catch (err) {
          next(err)
        }
      },
    ],
  },
]