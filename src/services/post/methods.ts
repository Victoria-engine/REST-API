import { PostVisibility } from '../../types'
import Post from '../../models/post'
import { HTTP404Error } from '../../util/errors/httpErrors'

export type CreatePostPayload = {
  title: string,
  text: string,
  user_id: string,
  blog_id: string,
  visibility: PostVisibility,
  description?: string,
}
export const createPost = async (args: CreatePostPayload) => {
  if (!args.user_id || !args.text || !args.blog_id || !args.visibility) return

  try {
    return await new Post(args).save()
  } catch (err) {
    throw new Error(err)
  }
}

export const getPostByID = async (id: string, blog_id: string) => {
  try {
    return await Post
      .where<Post>({ id, blog_id })
      .fetch()
  } catch (err) {
    throw new HTTP404Error(`post with ID of ${id} does not exist on this blog`)
  }
}

export const getAuthorPosts = async (user_id: string) => {
  try {
    return await new Post().where('author_id', user_id).fetchAll()
  } catch (err) {
    throw new Error(`author with ID of ${user_id} does not exist`)
  }
}