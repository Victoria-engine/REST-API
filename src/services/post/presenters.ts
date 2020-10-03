import Post from '../../models/post'

export const present = (post: Post) => {
  const { id, title, authorID, text } = post

  return { id, title, text, authorID }
}