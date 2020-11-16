import { Bookshelf } from '../conn/knex'
import User from './user'

class RefreshToken extends Bookshelf.Model<RefreshToken> {
  get tableName() { return 'refresh_token' }
  get hasTimestamps() { return true }

  public get token(): string { return this.get('token') }
  public get expiration_date(): Date { return this.get('expiration_date') }
  public get user_id(): Date { return this.get('user_id') }

  user() {
    return this.belongsTo(User).query()
  }
}

export default RefreshToken