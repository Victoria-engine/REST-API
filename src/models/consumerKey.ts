import { Bookshelf } from '../conn/knex'

class ConsumerKey extends Bookshelf.Model<ConsumerKey> {
  get tableName() { return 'consumer_key' }

  public get value(): string { return this.get('value') }
}

export default ConsumerKey