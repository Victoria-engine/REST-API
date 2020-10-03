import Post from '../../models/post'

export type CreatePostPayload = { title: string, text: string, author_id: string }
export const createPost = async (args: CreatePostPayload) => {
  try {
    return await new Post(args).save()
  } catch (err) {
    throw new Error('Failed creating post, please check if the `author_id` is correct.')
  }
}