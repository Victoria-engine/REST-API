import { NextFunction, Request, Response } from 'express'
import { verifyJWT } from '../../middleware'
import { validateParams } from '../../middleware/paramValidation'
import {
  createBlog, createConsumerKey, deleteBlog, getBlogByID,
  getBlogFromContentKey, getConsumerKeyByID, updateBlog
} from '../../services/blog/methods'
import { presentBlog } from '../../services/blog/presenters'
import { getUserByID, updateUser } from '../../services/user/methods'
import { AuthenticatedRequest } from '../../types'
import { HTTP400Error, HTTPError } from '../../util/errors/httpErrors'

export default [
  {
    path: '/blog',
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const queryKey = req.query['key']?.toString()
          if (!queryKey) {
            throw new HTTP400Error('consumer key was not found in the query params')
          }

          const blog = await getBlogFromContentKey(queryKey)
          const blogPosts = await blog.posts().fetch({
            withRelated: ['user'],
          })

          res.status(200).json(presentBlog(blog, blogPosts))
        } catch (err) {
          next(err)
        }
      }
    ],
  },
  {
    path: '/blog',
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
          param_key: 'description',
          required: true,
          type: 'string',
          validator_functions: [(p) => p.length <= 100]
        },
      ]),

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userID = '' } = req
        const { title, description } = req.body

        try {
          const user = await getUserByID(userID)
          const hasBlog = Boolean(user.blog_id)
          if (hasBlog) {
            throw new HTTPError('user already has a blog', 409)
          }

          const consumerKey = await createConsumerKey()
          if (!consumerKey) {
            throw new Error('error while creating a consumer key')
          }

          const freshBlog = await createBlog({
            title, description,
            consumer_key_id: consumerKey.id,
          })
          if (!freshBlog) {
            throw new Error('blog was not created, something went wrong')
          }

          await user.save({
            blog_id: freshBlog.id,
          }, { patch: true })

          res.status(200).json(presentBlog(freshBlog))
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: '/blog',
    method: 'patch',
    handler: [
      verifyJWT,
      validateParams([
        {
          param_key: 'title',
          required: false,
          type: 'string',
          validator_functions: [(p) => p.length <= 60]
        },
        {
          param_key: 'description',
          required: false,
          type: 'string',
          validator_functions: [(p) => p.length <= 100]
        },
      ]),

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userID = '' } = req
        const { title, description } = req.body

        try {
          if (!title && !description) {
            throw new HTTP400Error('cannot update without a valid arguments')
          }

          const user = await getUserByID(userID)

          const blogID = user.blog_id
          if (!blogID) {
            throw new HTTP400Error('user does not have a blog')
          }

          const blog = await getBlogByID(blogID)
          const updatedBlog = await updateBlog(blog, {
            title, description
          })

          res.status(200).json(presentBlog(updatedBlog))
        } catch (err) {
          next(err)
        }

      }
    ]
  },
  {
    path: '/blog',
    method: 'delete',
    handler: [
      verifyJWT,

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userID = '' } = req

        try {
          const user = await getUserByID(userID)

          const blogID = user.blog_id
          if (!blogID) {
            throw new HTTP400Error('user does not have a blog')
          }

          // Set the user `blog_id` to null so the user isn't deleted
          await updateUser(user, { blog_id: null })

          await deleteBlog(blogID)

          res.status(200).json({
            success: true,
            message: 'blog deleted',
            blogID: blogID,
          })
        } catch (err) {
          next(err)
        }
      }
    ]
  },
  {
    path: '/blog/key',
    method: 'get',
    handler: [
      verifyJWT,

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userID = '' } = req

        try {
          const user = await getUserByID(userID)
          if (!user.blog_id) {
            throw new HTTPError('user does not have a blog', 404)
          }

          const userBlog = await getBlogByID(user.blog_id)
          if (!userBlog.consumerKeyID) {
            throw new HTTPError('no consumer key found in requested blog', 404)
          }

          const userConsumerKey = await getConsumerKeyByID(userBlog.consumerKeyID)

          res.status(200).json(userConsumerKey.value)
        } catch (err) {
          next(err)
        }
      }
    ]
  }
]