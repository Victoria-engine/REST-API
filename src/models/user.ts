import { Bookshelf } from '../conn/knex'


class User extends Bookshelf.Model<User> {
  get tableName() { return 'user' }
  get hasTimestamps() { return true }

  public get google_id(): string | null { return this.get('google_id') }
  public get blog_id(): string | null { return this.get('blog_id') }
  public get name(): string { return this.get('name') }
  public get email(): string { return this.get('email') }
  public get password(): string | null { return this.get('password') }
}

export default User