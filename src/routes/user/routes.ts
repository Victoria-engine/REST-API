import { NextFunction, Response } from 'express'
import { presentUser } from '../../services/user/presenters'
import { getUserByID } from '../../services/user/methods'
import { AuthenticatedRequest } from '../../types'
import { verifyJWT } from '../../middleware'
import { deleteBlog } from '../../services/blog/methods'
import { HTTP400Error } from '../../util/errors/httpErrors'

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
  {
    path: '/user',
    method: 'delete',
    handler: [
      verifyJWT,

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userID = '' } = req
        try {
          const user = await getUserByID(userID)

          if (!user.blog_id) {
            throw new HTTP400Error('user does not have a blog')
          }

          await deleteBlog(user.blog_id)

          res.status(200).json({
            success: true,
            message: 'User deleted!',
          })
        } catch (err) {
          next(err)
        }
      },
    ],
  },
]