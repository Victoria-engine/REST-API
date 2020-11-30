import { Collection } from 'bookshelf'
import User from '../../models/user'

export const presentUser = (user: User) => {
  const { id, email, name, blog_id } = user

  return { id, email, name, blogID: blog_id }
}