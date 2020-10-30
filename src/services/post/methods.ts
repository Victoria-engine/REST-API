import Post from '../../models/post'

export type CreatePostPayload = { title: string, text: string, author_id: string }
export const createPost = async (args: CreatePostPayload) => {
  try {
    return await new Post(args).save()
  } catch (err) {
    throw new Error('Failed creating post, please check if the `author_id` is correct.')
  }
}

export const getPostByID = async (id: string) => {
  try {
    return await Post.where<Post>({ id }).fetch()
  } catch (err) {
    throw new Error(`post with ID of ${id} does not exist`)
  }
}

export const getAuthorPosts = async (authorID: string) => {
  try {
    return await new Post().where('author_id', authorID).fetchAll()
  } catch (err) {
    throw new Error(`author with ID of ${authorID} does not exist`)
  }
}