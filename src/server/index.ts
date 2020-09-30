import express, { Application } from 'express'
import morgan from 'morgan'
import applyMiddleware from '../util/applyMiddleware'
import middlewares from '../middleware'
import routes from '../routes'
import applyRoutes from '../util/applyRoutes'

export default class Server {
  private static app: Application = express()

  public static init() {
    this.configureServices()
    this.configureMiddleware()
    this.configureRoutes()

    return this.app
  }

  private static configureServices() {
    this.app.use(morgan('dev'))
  }

  private static configureMiddleware() {
    applyMiddleware(middlewares, this.app)
  }

  private static configureRoutes() {
    applyRoutes(routes, this.app)
  }
}