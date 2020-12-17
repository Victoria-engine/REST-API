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
    debug: false, // set it `true` for finner test debug
  })
  mockKnex.mock(Knex)
} else {
  console.log("connection to ", envConfig)
  Knex = knex(envConfig)
  console.log("Connected !")
}

export const Bookshelf = bookshelf(Knex as any)

export default Knex