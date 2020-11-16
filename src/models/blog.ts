import { Bookshelf } from '../conn/knex'
import ConsumerKey from './consumerKey'
import Post from './post'
import User from './user'


class Blog extends Bookshelf.Model<Blog> {
  get tableName() { return 'blog' }
  get hasTimestamps() { return true }

  public get title(): string { return this.get('title') }
  public get description(): string { return this.get('description') }
  public get consumerKeyID(): number { return this.get('consumer_key_id') }

  user() {
    return this.belongsTo(User)
  }

  posts() {
    return this.hasMany<Post>(Post)
  }

  consumerKey() {
    return this.belongsTo<ConsumerKey>(ConsumerKey, 'consumer_key_id')
  }
}

export default Blog