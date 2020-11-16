import Post from '../../models/post'

export const presentPost = (post: Post) => {
  const { id, title, text } = post
  const { created_at } = post.attributes

  return { id, title, text, created_at }
}