import request from 'supertest'
import Server from '../../server'
import mockKnex from 'mock-knex'
import Post from '../../models/post'
import { jwtService } from '../../services/auth/jwt/jwt'

const tracker = mockKnex.getTracker()

const mockPost = {
  id: 1,
  title: 'Sample title',
  text: 'Sampel text',
  user_id: '2',
} as Post


describe('Post', () => {
  const mockServer = request(Server.init())
  describe('GET /post/:postID', () => {
    tracker.install()

    afterAll(() => tracker.uninstall())

    it('should return 404 for a none existent post', async () => {
      // Mock knex layer
      tracker.on('query', (query) => {
        query.response([])
      })

      const res = await mockServer.get('/post/2')

      expect(res.status).toEqual(404)
      expect(res.body.message).toEqual('post with ID of 2 does not exist')
    })

    it('should return a 200 with a post', async () => {
      tracker.on('query', (query) => {
        query.response([mockPost])
      })

      const res = await mockServer.get('/post/1')

      expect(res.status).toEqual(200)
      expect(res.body).toEqual(mockPost)
    })
  })

  describe('GET /posts/:user_id', () => {
    /*     tracker.install()

        afterAll(() => tracker.uninstall())
     */
    /*     it('should return 404 for a none existent author', async () => {
          tracker.on('query', (query) => {
            query.response([])
          })

          const res = await mockServer.get('/posts/2')

          expect(res.status).toEqual(404)
          expect(res.body.message).toEqual('post with ID of 2 does not exist')
        }) */

    /*     it('should return a 200 with a post', async () => {
          tracker.on('query', (query) => {
            query.response([mockPost])
          })

          const res = await mockServer.get('/post/1')

          expect(res.status).toEqual(200)
          expect(res.body).toEqual(mockPost)
        }) */
  })
})

describe('POST /post', () => {
  tracker.install()
  const mockServer = request(Server.init())

  afterAll(() => tracker.uninstall())


  it('should return 401 for invalid authentication', async () => {
    const res = await mockServer.post('/post')

    expect(res.status).toEqual(401)
    expect(res.body.message).toEqual('no authorization header or cookie, please refer to the documentation')
  })

  it('should return 400 for invalid args', async () => {
    // mock JWT service
    jwtService.verify = jest.fn().mockImplementation(() => ({
      id: 'some-user-id'
    }))

    const res = await mockServer.post('/post')
      .set('Authorization', 'Bearer some-stub-token')


    expect(res.status).toEqual(400)
    expect(res.body.message).toEqual('missing parameter title')
  })
})