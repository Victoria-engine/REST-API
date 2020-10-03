import User from '../../models/user'

export const getAllUsers = async () => {
  const users = await new User().fetchAll()

  return users
}

export type CreateUserPayload = { password: string, email: string, name: string }
export const createUser = async (args: CreateUserPayload) => {
  const user = await new User(args)

  await user.save()

  return user
}

export const getUserByID = async (id: string) => {
  const user = await User.where<User>({ id }).fetch()
  return user
}