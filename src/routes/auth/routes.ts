import { NextFunction, Request, Response } from 'express'
import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from '../../globals'
import { validateParams } from '../../middleware/paramValidation'
import { jwtService } from '../../services/auth/jwt/jwt'
import { loginUser } from '../../services/auth/oauth2/login'
import { GoogleSerivce } from '../../services/auth/oauth2/google'
import { createUser, getUserByGoogleID } from '../../services/user/methods'
import { HTTP400Error, HTTP401Error } from '../../util/errors/httpErrors'
import refreshTokenMethods from '../../services/auth/oauth2/refreshToken'
import { createAccessToken, getTokenExpirationDate } from '../../services/auth/oauth2/methods'
import { DecodedToken } from '../../types'

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
    path: '/auth/session',
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
          const { accessToken, refreshToken } = await loginUser({ email, password })

          res.status(200)
            .cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken.token,
              {
                secure: true, httpOnly: true,
                expires: getTokenExpirationDate(accessToken)
              })
            .cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token,
              {
                secure: true, httpOnly: true,
                expires: getTokenExpirationDate(refreshToken)
              })
            .json({
              message: 'success',
            })
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: '/auth/refresh',
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const refreshToken = jwtService.getTokenFromRequest(req)
          let decodedToken: DecodedToken

          // verify the refresh token
          try {
            decodedToken = jwtService.verify(refreshToken) as DecodedToken
            if (!decodedToken.id) {
              throw new Error('user id not found in access token')
            }
          }
          catch (err) {
            // if the refresh token is invalid the client has to login again
            throw new HTTP401Error('invalid refresh token')
          }

          const userID = decodedToken.id.toString()

          const dbRefreshTokenEntity = await refreshTokenMethods.get(refreshToken)
          if (!dbRefreshTokenEntity) {
            throw new HTTP401Error('refresh token does not exist')
          }

          const newToken = await createAccessToken({ email: decodedToken.email, id: userID })

          res.status(200)
            .cookie(ACCESS_TOKEN_COOKIE_KEY, newToken.token,
              {
                secure: true, httpOnly: true,
                expires: getTokenExpirationDate(newToken)
              })
            .json({
              message: 'success',
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
          next(err)
        }
      },
    ],
  }
]