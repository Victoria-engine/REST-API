require('dotenv').config()

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: DB_NAME || '',
      user: DB_USER || '',
      password: DB_PASSWORD || '',
      host: DB_HOST || 'localhost',
      port: DB_PORT || 3306,
    },
    migrations: {
      directory: __dirname + '/db/src/migrations',
    },
    seeds: {
      directory: __dirname + '/db/src/seeds',
    },
  },
  

  staging: {
    client: 'mysql',
    connection: {
      database: DB_NAME || '',
      user: DB_USER || '',
      password: DB_PASSWORD || '',
      host: DB_HOST || 'localhost',
      port: DB_PORT || 3306,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      database: DB_NAME || '',
      user: DB_USER || '',
      password: DB_PASSWORD || '',
      host: DB_HOST || 'localhost',
      port: DB_PORT || 3306,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
