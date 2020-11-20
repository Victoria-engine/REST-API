import Post from '../../models/post'

export const presentPost = (post: Post) => {
  const { id, title, text, visibility, description } = post
  const { created_at } = post.attributes

  return { id, title, text, visibility, description, created_at }
}