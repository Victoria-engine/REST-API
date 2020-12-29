import { NextFunction, Request, Response } from 'express'
import Post, { postVisibility } from '../../models/post'
import { isValidVisibility, PostVisibility } from '../../types'
import { verifyJWT } from '../../middleware'
import { validateParams } from '../../middleware/paramValidation'
import { getBlogByID, getBlogFromContentKey } from '../../services/blog/methods'
import { createPost, deletePost, getBlogPosts, getPostByID, updatePost } from '../../services/post/methods'
import { presentPost } from '../../services/post/presenters'
import { getUserByID } from '../../services/user/methods'
import { AuthenticatedRequest } from '../../types'
import { HTTP400Error } from '../../util/errors/httpErrors'
import Bookshelf from 'bookshelf'
import { ADMIN_ROUTE_PREFIX } from '../../globals'


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
    path: '/admin/post/:postID',
    method: 'get',
    handler: [
      verifyJWT,

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { postID } = req.params
        const { userID = '' } = req

        try {
          const user = await getUserByID(userID)
          const blogID = user.blog_id
          if (!blogID) {
            throw new HTTP400Error('user does not have a blog')
          }

          const post = await getPostByID(postID, blogID, PostVisibility.All)
          res.status(200).json(presentPost(post))
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: '/posts',
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const queryKey = req.query['key']?.toString()
          if (!queryKey) {
            throw new HTTP400Error('consumer key was not found in the query params')
          }

          const blog = await getBlogFromContentKey(queryKey)
          const posts = await getBlogPosts(blog, PostVisibility.Public)

          const prettyPosts = (posts as Bookshelf.Collection<Post>).map(p => presentPost(p))

          res.status(200).json(prettyPosts)
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: `${ADMIN_ROUTE_PREFIX}/posts`,
    method: 'get',
    handler: [
      verifyJWT,

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userID = '' } = req
        const visibility = req.query['visibility']?.toString() || 'all'

        try {
          if (!isValidVisibility(visibility)) {
            throw new HTTP400Error(`Invalid visibility option: ${visibility}. Valid optins are: ${Object.values(PostVisibility).map(v => v)}`)
          }

          const user = await getUserByID(userID)
          const blogID = user.blog_id
          if (!blogID) {
            throw new HTTP400Error('user does not have a blog')
          }
          const blog = await getBlogByID(blogID)
          const posts = await getBlogPosts(blog, visibility)

          const prettyPosts = (posts as Bookshelf.Collection<Post>).map(p => presentPost(p))

          res.status(200).json(prettyPosts)
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: `${ADMIN_ROUTE_PREFIX}/post`,
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
        {
          param_key: 'description',
          required: false,
          type: 'string',
          validator_functions: [(p) => p.length <= 255],
        },
        {
          param_key: 'visibility',
          required: false,
          type: 'string',
          validator_functions: [(p) => postVisibility.includes(p)],
        },
      ]),

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userID = '' } = req
        const { title, text, visibility = 'not-listed', description } = req.body

        try {
          const user = await getUserByID(userID)

          const blogID = user.blog_id
          if (!blogID) {
            throw new HTTP400Error('user does not have a blog')
          }

          const freshPost = await createPost({
            title,
            text,
            user_id: userID,
            blog_id: blogID,
            visibility,
            description,
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
  },
  {
    path: `${ADMIN_ROUTE_PREFIX}/post/:postID`,
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
          param_key: 'text',
          required: false,
          type: 'string',
          validator_functions: [(p) => p.length <= 100000]
        },
        {
          param_key: 'description',
          required: false,
          type: 'string',
          validator_functions: [(p) => p.length <= 255],
        },
        {
          param_key: 'visibility',
          required: false,
          type: 'string',
          validator_functions: [(p) => postVisibility.includes(p)],
        },
      ]),

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { userID = '' } = req
        const { postID } = req.params
        const { title, text, visibility, description } = req.body

        try {
          if (!postID) {
            throw new HTTP400Error('postID is missing in query params')
          }

          const user = await getUserByID(userID)

          const blogID = user.blog_id
          if (!blogID) {
            throw new HTTP400Error('user does not have a blog')
          }

          const post = await getPostByID(postID, blogID)

          const updatedPost = await updatePost(post, {
            title,
            text,
            visibility,
            description,
          })
          if (!updatedPost) {
            throw new Error('something went wrong updating the post')
          }

          res.status(200).json(presentPost(updatedPost))
        } catch (err) {
          next(err)
        }
      }
    ]
  },
  {
    path: `${ADMIN_ROUTE_PREFIX}/post/:postID`,
    method: 'delete',
    handler: [
      verifyJWT,

      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { postID } = req.params

        try {
          if (!postID) {
            throw new HTTP400Error('postID is missing in query params')
          }

          await deletePost(postID)

          res.status(200).json({
            success: true,
            message: 'post deleted',
          })
        } catch (err) {
          res.status(401).json({
            message: err.message,
          })
          next(err)
        }
      },
    ],
  },
]