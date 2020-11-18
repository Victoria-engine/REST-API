import User from '../../models/user'
import { CreateUserPayload, UpdateUserPayload } from '../../types'
import { HTTP401Error } from '../../util/errors/httpErrors'

export const getAllUsers = async () => {
  const users = await new User().fetchAll()

  return users
}


export const createUser = async (args: CreateUserPayload) => {
  try {
    return await new User(args).save()
  } catch (err) {
    throw new Error(err)
  }
}

export const updateUser = async (user: User, args: UpdateUserPayload) => {
  try {
    return await user.save(args, { patch: true })
  } catch (err) {
    throw new Error(err)
  }
}

export const getUserByID = async (id: string) => {
  try {
    return await User.where<User>({ id }).fetch()
  } catch (err) {
    throw new Error(`user with id of ${id} does not exist`)
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    return await User.where<User>({ email }).fetch()
  } catch (err) {
    throw new HTTP401Error('no user found with such credentials')
  }
}

export const getUserByGoogleID = async (google_id: string) => {
  try {
    return await User.where<User>({ google_id }).fetch()
  } catch (err) {
    throw new HTTP401Error('no google user found with such credentials')
  }
}