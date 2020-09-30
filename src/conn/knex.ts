import knex from 'knex'
import bookshelf from 'bookshelf'
const config = require('../../knexfile')
import { environment } from '../globals'

const envConfig = config[environment]
const Knex = knex(envConfig)
export const Bookshelf = bookshelf(Knex as any)

export default Knex