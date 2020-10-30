import knex from 'knex'
import bookshelf from 'bookshelf'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../knexfile')
import { environment } from '../globals'
import mockKnex from 'mock-knex'

const envConfig = config[environment]

let Knex

if (environment === 'test') {
  Knex = knex({
    client: 'mysql',
    debug: false,
  })
  mockKnex.mock(Knex)
} else {
  Knex = knex(envConfig)
}

export const Bookshelf = bookshelf(Knex as any)

export default Knex