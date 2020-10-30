import { Handler, Router } from 'express'
import signale from 'signale'
import { environment } from '../globals'

type Route = {
  path: string,
  handler: Handler | Handler[],
  method: string,
}

const applyRoutes = (routes: Route[], router: Router) => {
  if (environment !== 'test') {
    signale.log('[applyRoutes]: Creating routes...')
  }

  for (const route of routes) {
    // eslint-disable-next-line semi
    const { method, path, handler } = route;
    if (environment !== 'test') {
      // eslint-disable-next-line semi
      signale.log('   -> Created: ', method.toUpperCase(), path);
    }

    (router as any)[method](path, handler)
  }
}

export default applyRoutes