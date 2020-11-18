import Blog from '../../models/blog'
import { v4 as uuidv4 } from 'uuid'
import ConsumerKey from '../../models/consumerKey'
import { HTTP401Error } from '../../util/errors/httpErrors'
import { CreateBlogPayload, UpdateBlogPayload } from '../../types'

/**
 * Consumer keys allow the consumtion of public endpoints for the users
 */
const generateConsumerKey = () => {
  return uuidv4()
}

export const createConsumerKey = async () => {
  try {
    return await new ConsumerKey({
      value: generateConsumerKey(),
    }).save()
  } catch (err) {
    throw new Error(err)
  }
}

export const getConsumerKey = async (value: string) => {
  try {
    return await ConsumerKey.where<ConsumerKey>({ value }).fetch()
  } catch (err) {
    throw new HTTP401Error('no consumer key found with such value')
  }
}

export const getConsumerKeyByID = async (id: number) => {
  try {
    return await ConsumerKey.where<ConsumerKey>({ id }).fetch()
  } catch (err) {
    throw new HTTP401Error('no consumer key found with such id')
  }
}

export const getBlogFromConsumerKey = async (consumerKeyID: string) => {
  try {
    return await Blog.where<Blog>({ consumer_key_id: consumerKeyID }).fetch()
  } catch (err) {
    throw new HTTP401Error('no consumer key found with such id')
  }
}

export const createBlog = async (args: CreateBlogPayload) => {
  if (!args.consumer_key_id || !args.description || !args.title) return

  try {
    return await new Blog(args).save()
  } catch (err) {
    throw new Error(err)
  }
}

export const updateBlog = async (blog: Blog, args: UpdateBlogPayload) => {
  try {
    return await blog.save(args, { patch: true })
  } catch (err) {
    throw new Error(err)
  }
}

export const getBlogFromContentKey = async (consumerKeyValue: string) => {
  // check if key exist in DB
  const consumerKey = await getConsumerKey(consumerKeyValue)

  return await getBlogFromConsumerKey(consumerKey.id)
}

export const getBlogByID = async (id: string) => {
  try {
    return await new Blog().where({ id }).fetch()
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteBlog = async (id: string) => {
  try {
    return await Blog.where<Blog>({ id }).destroy()
  } catch (err) {
    throw new Error(err)
  }
}