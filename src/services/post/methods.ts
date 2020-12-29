import { CreatePostPayload, PostVisibility, UpdatePostPayload } from '../../types'
import { HTTP404Error } from '../../util/errors/httpErrors'
import Blog from '../../models/blog'
import Post from '../../models/post'


export const createPost = async (args: CreatePostPayload) => {
  if (!args.user_id || !args.text || !args.blog_id || !args.visibility) return

  try {
    return await new Post(args).save()
  } catch (err) {
    throw new Error(err)
  }
}

export const updatePost = async (post: Post, args: UpdatePostPayload) => {
  try {
    return await post.save(args, { patch: true })
  } catch (err) {
    throw new Error(err)
  }
}

export const getPostByID = async (id: string, blog_id: string, visibility = PostVisibility.Public) => {
  try {
    if (visibility === PostVisibility.All) {
      return await Post
        .where<Post>({ id, blog_id })
        .fetch({
          withRelated: ['user']
        })
    }

    return await Post
      .where<Post>({ id, blog_id, visibility })
      .fetch({
        withRelated: ['user']
      })
  } catch (err) {
    throw new HTTP404Error(`post with ID of ${id} does not exist on this blog`)
  }
}

export const getUserPosts = async (user_id: string) => {
  try {
    return await new Post().where('user_id', user_id).fetchAll({
      withRelated: ['user'],
    })
  } catch (err) {
    throw new Error(`author with ID of ${user_id} does not exist`)
  }
}

export const deletePost = async (id: string) => {
  try {
    return await Post.where<Post>({ id }).destroy()
  } catch (err) {
    throw new Error(err)
  }
}

export const getBlogPosts = async (blog: Blog, visibility = PostVisibility.All) => {
  try {
    if (visibility === PostVisibility.All) {
      return await blog.posts()
        .fetch({ withRelated: ['user'] })
    }

    return await blog.posts()
      .where({ 'visibility': visibility }, false)
      .fetch({ withRelated: ['user'] })
  } catch (err) {
    throw new Error(err)
  }
}
