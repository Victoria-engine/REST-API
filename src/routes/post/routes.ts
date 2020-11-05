import { NextFunction, Request, Response } from 'express'
import { jwtVerify } from '../../middleware'
import { validateParams } from '../../middleware/paramValidation'
import { createPost, getAuthorPosts, getPostByID } from '../../services/post/methods'
import { AuthenticatedRequest } from '../../types'

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
    path: '/posts/:user_id',
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params
        try {
          const userPosts = await getAuthorPosts(user_id)
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
      jwtVerify,
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
        const { userID = '' } = req
        const { title, text } = req.body

        try {
          const freshPost = await createPost({ title, text, user_id: userID })
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