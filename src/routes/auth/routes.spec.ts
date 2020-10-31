import request from 'supertest'
import bcrypt from 'bcrypt'
import Server from '../../server'
import mockKnex from 'mock-knex'
import { LoginUserPayload } from '../../types'
import User from '../../models/user'
import { GoogleSerivce } from '../../services/auth/oauth2/google'

const tracker = mockKnex.getTracker()

describe('Auth', () => {
  const mockServer = request(Server.init())

  describe('Internal', () => {
    describe('POST /auth/login', () => {
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

        const res = await mockServer.post('/auth/login')
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

        const res = await mockServer.post('/auth/login')
          .send({
            email: 'stub@mail.com',
            password: 'stub',
            google_id: '',
          } as LoginUserPayload)

        expect(res.status).toEqual(401)
        expect(res.body.message).toEqual('no user found with such credentials')
      })

      it('should return 200 for a successfull login and an access token', async () => {
        // Mock knex layer
        tracker.on('query', (query) => {
          query.response([{
            email: 'stub@mail.com',
            password: bcrypt.hashSync('stub', 1),
            id: 1,
            name: 'stub name',
          } as User])
        })

        const res = await mockServer.post('/auth/login')
          .send({
            email: 'stub@mail.com',
            password: 'stub',
            google_id: '',
          } as LoginUserPayload)

        expect(res.status).toEqual(200)
        expect(res.body.access_token).toBeTruthy()
      })
    })
  })

  describe('Google OAuth2', () => {
    describe('POST /auth/login', () => {
      tracker.install()

      // Mock google service methods
      GoogleSerivce.getUserData = jest.fn().mockImplementation(() => ({
        id: 42,
        name: 'stub name',
        email: 'stub@mail.com',
      }))

      afterAll(() => tracker.uninstall())

      it('should return 400 bad request if missing a google token', async () => {
        const res = await mockServer.post('/auth/google')

        expect(res.status).toEqual(400)
        expect(res.body.message).toEqual('missing parameter access_token')
      })

      it('should return 500 bad request if the google providers fails', async () => {
        GoogleSerivce.getUserData = jest.fn().mockImplementation(() => null)

        const res = await mockServer.post('/auth/google')
          .send({
            access_token: 'some-googe-provided-token'
          })

        expect(res.status).toEqual(500)
        expect(res.body.message).toEqual('failed getting user data from google oauth2')
      })

    })
  })
})