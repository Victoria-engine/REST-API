import { Bookshelf } from '../conn/knex'
import Post from './post'

class User extends Bookshelf.Model<User> {
  get tableName() { return 'user' }
  get hasTimestamps() { return true }

  public get name(): string { return this.get('name') }
  public get email(): string { return this.get('email') }
  public get password(): string { return this.get('password') }

  posts() {
    return this.hasMany(Post)
  }
}

export default User