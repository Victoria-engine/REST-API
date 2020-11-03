import { Bookshelf } from '../conn/knex'
import User from './user'

class AccessToken extends Bookshelf.Model<AccessToken> {
  get tableName() { return 'access_token' }
  get hasTimestamps() { return true }

  user() {
    return this.belongsTo(User)
      .query((qb) => {
        qb.whereNull('user.deleted_at')
      })
  }
}

export default AccessToken