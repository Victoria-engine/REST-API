import { NextFunction, Request, Response } from 'express'
import { JWTTokenVerify } from '../../middleware'
import { validateParams } from '../../middleware/paramValidation'
import { createPost, getAuthorPosts, getPostByID } from '../../services/post/methods'
import { AuthenticatedRequest } from '../../types'
import { HTTP401Error } from '../../util/errors/httpErrors'

export default [
  {
    path: '/post/:postID',
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const { postID } = req.params
        try {
          const post = await getPostByID(postID)
          res.status(200).json(post)
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: '/posts/:authorID',
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const { authorID } = req.params
        try {
          const userPosts = await getAuthorPosts(authorID)
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
      validateParams([
        {
          param_key: 'title',
          required: true,
          type: 'string',
          validator_functions: [(p) => p.length <= 60]
        },
        {
          param_key: 'text',
          required: true,
          type: 'string',
          validator_functions: [(p) => p.length <= 100000]
        },
      ]),

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { title, text } = req.body

        try {
          const { userID } = req
          if (!userID) {
            throw new HTTP401Error('invalid auth, no user ID in request context')
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