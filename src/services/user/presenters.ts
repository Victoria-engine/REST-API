import User from '../../models/user'

export const presentUser = (user: User) => {
  const { id, email, name, blog_id } = user
  const { created_at } = user.attributes

  return { id, email, name, blogID: blog_id, created_at }
}