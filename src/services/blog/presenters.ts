import Bookshelf from 'bookshelf'
import Blog from '../../models/blog'
import Post from '../../models/post'
import { presentPost } from '../post/presenters'

export const presentBlog = (blog: Blog, posts?: Bookshelf.Collection<Post>) => {
  const { id, title, description } = blog

  return {
    id, title, description,
    posts: posts?.map((p) => presentPost(p))
  }
}