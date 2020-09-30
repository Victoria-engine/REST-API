const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env

const conn = {
  database: DB_NAME || '',
  password: DB_PASSWORD || '',
  user: DB_USER || '',
  host: DB_HOST || '',
  port: DB_PORT || '',
}

export default conn