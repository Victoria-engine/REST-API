import { Bookshelf } from '../conn/knex'

class User extends Bookshelf.Model<User> {
  get tableName() { return 'user' }
  get hasTimestamps() { return true }  
}

export default User