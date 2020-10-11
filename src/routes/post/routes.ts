import { NextFunction, Request, Response } from 'express'
import { JWTTokenVerify } from '../../middleware'
import Post from '../../models/post'
import { createPost } from '../../services/post/methods'
import { AuthenticatedRequest } from '../../types'
import { HTTP401Error } from '../../util/errors/httpErrors'

export default [
  {
    path: '/posts/:authorID',
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const { authorID } = req.params
        try {
          const userPosts = await new Post().where('author_id', authorID).fetchAll()

          res.status(200).json(userPosts)
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: '/post',
    method: 'post',
    handler: [
      JWTTokenVerify,

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { title, text } = req.body

        try {
          const { userID } = req
          if (!userID) {
            throw new HTTP401Error('Invalid auth, no user ID in request context.')
          }

          const freshPost = await createPost({ title, text, author_id: userID })

          res.status(200).json(freshPost)
        } catch (err) {
          res.status(401).json({
            message: err.message,
          })
          next(err)
        }
      },
    ],
  }
]