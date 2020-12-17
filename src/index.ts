import { config } from 'dotenv'
import Server from './server'
import { createServer } from 'http'
import signale from 'signale'

// Setup env variables to be used
config()

const { PORT } = process.env

const start = () => {
  console.log("Starting with...", process.env)
  const applicationServer = Server.init()
  const server = createServer(applicationServer)

  server.listen({
    host: '0.0.0.0',
    port: PORT,
  })
  server.on('listening', onListing)
  server.on('error', onError)

  process.on('uncaughtException', event => {
    signale.log('uncaughtException', event)
    process.exit(1)
  })
  process.on('unhandledRejection', event => {
    signale.log('unhandledRejection', event)
    process.exit(1)
  })

  function onListing() {
    signale.success(`🚀  Server listening on port ${PORT} `)
  }

  function onError(error: Error) {
    signale.error('There was an error:', error)
  }
}

start()