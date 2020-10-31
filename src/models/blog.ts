import { Bookshelf } from '../conn/knex'

class Blog extends Bookshelf.Model<Blog> {
  get tableName() { return 'blog' }
  get hasTimestamps() { return true }

  public get title(): string { return this.get('title') }
  public get description(): string { return this.get('description') }
  public get consumer_key(): string { return this.get('consumer_key') }
}

export default Blog