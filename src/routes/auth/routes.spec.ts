import request from 'supertest'
import bcrypt from 'bcrypt'
import Server from '../../server'
import mockKnex from 'mock-knex'
import { LoginUserPayload } from '../../types'
import User from '../../models/user'
import { GoogleSerivce } from '../../services/auth/oauth2/google'
import { ERRORS_MSG, REFRESH_TOKEN_COOKIE_KEY } from '../../globals'

const tracker = mockKnex.getTracker()

describe('Auth', () => {
  const mockServer = request(Server.init())

  describe('Internal OAuth', () => {
    describe('POST /auth/session', () => {
      tracker.install()

      afterAll(() => tracker.uninstall())

      it('should return 401 for an auth with invalid password', async () => {
        // Mock knex layer
        tracker.on('query', (query) => {
          query.response([
            {
              email: 'stub@mail.com',
              password: 'asd',
              id: 1,
              name: 'stub name',
            } as User
          ])
        })

        const res = await mockServer.post('/auth/session')
          .send({
            email: 'stub@mail.com',
            password: 'stub',
            google_id: '',
          } as LoginUserPayload)

        expect(res.status).toEqual(401)
        expect(res.body.message).toEqual('wrong password')
      })

      it('should return 401 for a user that does not exist', async () => {
        // Mock knex layer
        tracker.on('query', (query) => {
          query.response([])
        })

        const res = await mockServer.post('/auth/session')
          .send({
            email: 'stub@mail.com',
            password: 'stub',
            google_id: '',
          } as LoginUserPayload)

        expect(res.status).toEqual(401)
        expect(res.body.message).toEqual('no user found with such credentials')
      })

      it('should return 200 for a successfull login and an access and refresh tokens', async () => {
        // Mock knex layer
        tracker.on('query', (query) => {
          query.response([{
            email: 'stub@mail.com',
            password: bcrypt.hashSync('stub', 1),
            id: 1,
            name: 'stub name',
          } as User])
        })

        const res = await mockServer.post('/auth/session')
          .send({
            email: 'stub@mail.com',
            password: 'stub',
            google_id: '',
          } as LoginUserPayload)

        const cookiesHeader = res.headers['set-cookie']
        const accessToken = cookiesHeader[0]
        const refreshToken = cookiesHeader[1]

        expect(res.status).toEqual(200)
        expect(accessToken).toBeTruthy()
        expect(refreshToken).toBeTruthy()
      })


      it('should return 200 for a successfull refresh and a new access token', async () => {
        // LOGIN
        tracker.on('query', (query) => {
          query.response([{
            email: 'stub@mail.com',
            password: bcrypt.hashSync('stub', 1),
            id: 1,
            name: 'stub name',
          } as User])
        })

        const res = await mockServer.post('/auth/session')
          .send({
            email: 'stub@mail.com',
            password: 'stub',
            google_id: '',
          } as LoginUserPayload)

        const cookiesHeader = res.headers['set-cookie']
        const refreshToken = (cookiesHeader[1] as string)
          .slice(REFRESH_TOKEN_COOKIE_KEY.length + 1)
          .split(';')[0]

        const newRes = await mockServer.post('/auth/refresh')
          .set('Authorization', `Bearer ${refreshToken}`)

        expect(newRes.status).toEqual(200)

        const newCookiesHeader = newRes.headers['set-cookie']
        const newAccessToken = newCookiesHeader[0]

        expect(newAccessToken).toBeTruthy()
      })
    })

    describe('POST /auth/refresh', () => {
      tracker.install()

      afterAll(() => tracker.uninstall())

      it('should return 401 for an invalid refresh token', async () => {
        const res = await mockServer.post('/auth/refresh')
          .set('Authorization', 'Bearer some-refresh-token')

        expect(res.status).toEqual(401)
        expect(res.body.message).toEqual('invalid refresh token')
      })
    })
  })

  describe('Google OAuth2', () => {
    describe('POST /auth/session', () => {
      tracker.install()

      // Mock google service methods
      GoogleSerivce.getUserData = jest.fn().mockImplementation(() => ({
        id: 42,
        name: 'stub name',
        email: 'stub@mail.com',
      }))

      afterAll(() => tracker.uninstall())

      it('should return 401 if missing a google token', async () => {
        const res = await mockServer.post('/auth/google')

        expect(res.body.message).toEqual(ERRORS_MSG.MISSING_AUTH)
        expect(res.status).toEqual(401)
      })

      it('should fail if the google token is invalid', async () => {
        GoogleSerivce.getUserData = jest.fn().mockImplementation(() => null)

        const res = await mockServer.post('/auth/google')
          .set('Authorization', 'Bearer some-invalid-token')

        expect(res.status).toEqual(500)
        expect(res.body.message).toEqual('failed getting user data from google oauth2')
      })

    })
  })
})