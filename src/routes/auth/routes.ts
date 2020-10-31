import { NextFunction, Request, Response } from 'express'
import { validateParams } from '../../middleware/paramValidation'
import { loginUser } from '../../services/auth/methods'
import { GoogleSerivce } from '../../services/auth/oauth2/google'
import { createUser, getUserByGoogleID } from '../../services/user/methods'
import { HTTP400Error } from '../../util/errors/httpErrors'

export default [
  {
    path: '/auth/google',
    method: 'post',
    handler: [
      validateParams([
        {
          param_key: 'access_token',
          required: true,
          type: 'string',
        },
      ]),

      async (req: Request, res: Response, next: NextFunction) => {
        const { access_token } = req.body

        try {
          if (!access_token) {
            throw new HTTP400Error('missing google access_token')
          }

          const userData = await GoogleSerivce.getUserData(access_token)
          if (!userData) {
            throw new Error('failed getting user data from google oauth2')
          }

          const user = await getUserByGoogleID(userData.id)
          const shouldCreateNewUser = !user
          if (shouldCreateNewUser) {
            // TODO: Should this prompt to a new page to fill new data ??? or this is the default
            // create new user
            const freshUser = await createUser({
              email: userData.email,
              name: userData.name,
              google_id: userData.id,
              //TODO: Store more google info
            })

            if (!freshUser) {
              throw new Error('failed creating user from google oauth2')
            }

            const accessToken = await loginUser({
              email: freshUser.email,
              google_id: freshUser.id,
            })

            res.status(200).json(accessToken)
            return
          }

          const accessToken = await loginUser({
            email: userData.email,
            google_id: userData.id,
          })

          res.status(200).json({
            access_token: accessToken,
          })
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: '/auth/login',
    method: 'post',
    handler: [
      validateParams([
        {
          param_key: 'email',
          required: true,
          type: 'string',
          validator_functions: [(p) => p.length <= 50]
        },
        {
          param_key: 'password',
          required: true,
          type: 'string',
          validator_functions: [(p) => p.length <= 100 && p.length >= 3]
        },
      ]),

      async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body
        try {
          const accessToken = await loginUser({ email, password })

          res.status(200).json({
            access_token: accessToken,
          })
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: '/auth/register',
    method: 'post',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          throw new Error('Not implememented!')
        } catch (err) {
          res.status(401).json({
            message: err.message,
          })
          next(err)
        }
      },
    ],
  }
]