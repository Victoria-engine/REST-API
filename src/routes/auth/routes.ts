import { NextFunction, Request, Response } from 'express'
import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from '../../globals'
import { validateParams } from '../../middleware/paramValidation'
import { jwtService } from '../../services/auth/jwt/jwt'
import { loginUser, registerUser } from '../../services/auth/oauth2/auth'
import { GoogleSerivce } from '../../services/auth/oauth2/google'
import { getUserByGoogleID } from '../../services/user/methods'
import { HTTP400Error, HTTP401Error } from '../../util/errors/httpErrors'
import { refreshTokenRepository } from '../../services/auth/oauth2/refreshToken'
import { createAccessToken, getTokenExpirationDate } from '../../services/auth/oauth2/methods'
import { DecodedToken } from '../../types'


export default [
  {
    path: '/auth/google',
    method: 'post',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const code = req.query['code']?.toString()

        try {
          if (!code) {
            throw new HTTP400Error('missing code query param')
          }

          const { access_token } = await GoogleSerivce.exchangeAccessTokenForCode(code)
          if (!access_token) {
            throw new HTTP401Error('missing google access_token')
          }

          const googleUserData = await GoogleSerivce.getUserData(access_token)

          let user = null
          try {
            user = await getUserByGoogleID(googleUserData.id)
          } finally {
            if (!user) {
              // The google user is registered with the public google data
              user = await registerUser(googleUserData)
            }

            const { accessToken, refreshToken } = await loginUser({
              email: googleUserData.email,
              google_id: googleUserData.id,
            })

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
                access_token: accessToken.token,
                expiresIn: accessToken.expiresIn,
                refresh_token: refreshToken.token,
                scope: '*',
                token_type: 'Bearer',
              })
          }
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
              access_token: accessToken.token,
              expiresIn: accessToken.expiresIn,
              refresh_token: refreshToken.token,
              scope: '*',
              token_type: 'Bearer',
            })
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: '/auth/refresh',
    method: 'post',
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

          const dbRefreshTokenEntity = await refreshTokenRepository.get(refreshToken)
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
              access_token: newToken.token,
              expiresIn: newToken.expiresIn,
              scope: '*',
              token_type: 'Bearer',
            })
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  /*   {
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
    } */
]