import userRoutes from './user/routes'
import postRoutes from './post/routes'
import authRoutes from './auth/routes'

export default [...userRoutes, ...postRoutes, ...authRoutes]