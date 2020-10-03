import User from '../../models/user'

export const present = (user: User) => {
  const { id, email, name } = user

  return { id, email, name }
}