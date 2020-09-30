import { Handler, Router } from 'express'
import signale from 'signale'

type Route = {
  path: string,
  handler: Handler | Handler[],
  method: string,
}

const applyRoutes = (routes: Route[], router: Router) => {
  signale.log('[applyRoutes]: Creating routes...');

  for (const route of routes) {
    const { method, path, handler } = route;

    signale.log('   -> Created: ', method, path);
    (router as any)[method](path, handler)
  }
}

export default applyRoutes