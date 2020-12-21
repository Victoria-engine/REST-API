import request from 'supertest'
import mockKnex from 'mock-knex'
import Server from '../../server'
import ConsumerKey from '../../models/consumerKey'
import Blog from '../../models/blog'
import Post from '../../models/post'
import { ADMIN_ROUTE_PREFIX, ERRORS_MSG } from '../../globals'
import { mockJWTVerifyMiddleware } from '../../util/mocks'


describe('Blog', () => {
  const tracker = mockKnex.getTracker()
  const mockServer = request(Server.init())

  describe('GET /blog', () => {
    tracker.install()

    afterAll(() => tracker.uninstall())

    it('should return 400 if no consumerKey is given in the arguments', async () => {
      const res = await mockServer.get('/blog')

      expect(res.status).toEqual(400)
      expect(res.body.message).toEqual('consumer key was not found in the query params')
    })

    it('should return 401 if the consumerKey is invalid', async () => {
      // Mock knex layer
      tracker.on('query', (query) => {
        query.response([])
      })

      const res = await mockServer.get('/blog?key=INVALID_KEY')

      expect(res.body.message).toEqual('no consumer key found with such value')
      expect(res.status).toEqual(401)
    })

    it('should return 200 with a blog result', async () => {
      // Mock knex layer
      tracker.on('query', (query) => {
        query.response([
          {
            id: 1,
            value: 'VALID_KEY',
          } as ConsumerKey,
          {
            id: 1,
            title: 'Blog title',
            description: 'Blog description',
          } as Blog,
          [
            {
              id: 1,
              title: 'post 1',
              text: 'some post text'
            } as Post
          ]
        ])
      })

      const res = await mockServer.get('/blog?key=VALID_KEY')

      expect(res.status).toEqual(200)
      expect(res.body.id).toEqual(1)
    })
  })

  describe('POST /blog', () => {
    const tracker = mockKnex.getTracker()
    const mockServer = request(Server.init())

    tracker.install()


    afterAll(() => tracker.uninstall())

    it('should return 401 if authentication is missing', async () => {
      const res = await mockServer.post(`${ADMIN_ROUTE_PREFIX}/blog`)

      expect(res.status).toEqual(401)
      expect(res.body.message).toEqual(ERRORS_MSG.MISSING_AUTH)
    })

    it('should return 400 if there are missing arguments', async () => {
      mockJWTVerifyMiddleware()

      const res = await mockServer.post(`${ADMIN_ROUTE_PREFIX}/blog`)
        .set('Authorization', 'Bearer some-stub-token')

      expect(res.body.message).toEqual('missing parameter title')
      expect(res.status).toEqual(400)

      const res2 = await mockServer.post(`${ADMIN_ROUTE_PREFIX}/blog`)
        .set('Authorization', 'Bearer some-stub-token')
        .send({
          title: 'stub title',
        })

      expect(res2.body.message).toEqual('missing parameter description')
      expect(res2.status).toEqual(400)
    })
  })

  describe('GET /blog/key', () => {
    const tracker = mockKnex.getTracker()
    const mockServer = request(Server.init())

    tracker.install()


    afterAll(() => tracker.uninstall())

    it('should return 401 if authentication is missing', async () => {
      const res = await mockServer.post(`${ADMIN_ROUTE_PREFIX}/blog/key`)

      expect(res.status).toEqual(401)
      expect(res.body.message).toEqual(ERRORS_MSG.MISSING_AUTH)
    })
  })
})
