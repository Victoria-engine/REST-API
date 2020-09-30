import { Router } from 'express'

type Wrapper = ((router: Router) => void)

/** Function that grabs thie list of middlewares and applies it on a router. */
const applyMiddleware = (middleware: Wrapper[], router: Router) => {
  for (const f of middleware) {
    f(router)
  }
}

export default applyMiddleware