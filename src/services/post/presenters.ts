import User from '../../models/user'
import Post from '../../models/post'

export const presentPost = (post: Post) => {
  const { id, title, text, visibility, description, updated_at } = post
  const { created_at } = post.attributes

  const author: User = post.related('user').serialize()

  return {
    id,
    title,
    text,
    visibility,
    description,
    created_at,
    updated_at,
    user: {
      id: author.id,
      name: author.name,
    },
  }
}