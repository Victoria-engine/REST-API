import Post from '../../models/post'

export const present = (post: Post) => {
  const { id, title, user_id, text } = post

  return { id, title, text, user_id }
}