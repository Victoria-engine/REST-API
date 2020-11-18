import { NextFunction, Request, Response } from 'express'
import { verifyJWT } from '../../middleware'
import { validateParams } from '../../middleware/paramValidation'
import { getBlogFromContentKey } from '../../services/blog/methods'
import { createPost, getAuthorPosts, getPostByID } from '../../services/post/methods'
import { presentPost } from '../../services/post/presenters'
import { getUserByID } from '../../services/user/methods'
import { AuthenticatedRequest } from '../../types'
import { HTTP400Error } from '../../util/errors/httpErrors'

export default [
  {
    path: '/post/:postID',
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const { postID } = req.params
        try {
          const queryKey = req.query['key']?.toString()
          if (!queryKey) {
            throw new HTTP400Error('consumer key was not found in the query params')
          }

          const blog = await getBlogFromContentKey(queryKey)

          const post = await getPostByID(postID, blog.id)
          res.status(200).json(presentPost(post))
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
      verifyJWT,
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
        // TODO: Add description
      ]),

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userID = '' } = req
        const { title, text } = req.body

        try {
          const user = await getUserByID(userID)

          const blogID = user.blog_id
          if (!blogID) {
            throw new HTTP400Error('user does not have a blog')
          }

          const freshPost = await createPost({
            title, text,
            user_id: userID,
            blog_id: blogID,
          })
          if (!freshPost) {
            throw new Error('something went wrong when creating a post')
          }

          res.status(200).json(presentPost(freshPost))
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