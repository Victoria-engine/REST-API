import { Bookshelf } from '../conn/knex'

class Post extends Bookshelf.Model<Post> {
  get tableName() { return 'post' }
  get hasTimestamps() { return true }

  public get title(): string { return this.get('title') }
  public get text(): string { return this.get('text') }
  public get authorID(): string { return this.get('author_id') }
}

export default Post