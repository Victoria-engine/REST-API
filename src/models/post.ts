import { Bookshelf } from '../conn/knex'
import { PostVisibility } from '../types'


export const postVisibility = ['public', 'not-listed', 'private']

class Post extends Bookshelf.Model<Post> {
  get tableName() { return 'post' }
  get hasTimestamps() { return true }

  public get title(): string { return this.get('title') }
  public get text(): string { return this.get('text') }
  public get description(): string { return this.get('description') }
  public get visibility(): PostVisibility { return this.get('visibility') }
  public get user_id(): string { return this.get('user_id') }
  public get blog_id(): string { return this.get('blog_id') }
}

export default Post