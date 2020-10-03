import { NextFunction, Request, Response } from 'express'
import Post from '../../models/post'
import { createPost } from '../../services/post/methods'

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
      async (req: Request, res: Response, next: NextFunction) => {
        const { title, text, author_id } = req.body

        try {
          const freshPost = await createPost({ title, text, author_id })

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