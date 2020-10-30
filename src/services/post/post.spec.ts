import mockKnex from 'mock-knex'
import { createPost } from './methods'

const tracker = mockKnex.getTracker()

describe('createPost', () => {
  tracker.install()

  beforeEach(() => {
    tracker.on('query', (query) => {
      query.response([
        {
          id: 1,
          title: 'Sample title',
          text: 'Sample text',
          authorID: '1',
        },
      ])
    })
  })

  afterAll(() => tracker.uninstall())

  it('should return a post', async () => {
    const res = await createPost({ author_id: '1', text: 'Sample text', title: 'Sample title' })
    expect(res?.title).toEqual('Sample title')
  })

  it('should return nothing if the args are wrong', async () => {
    const res = await createPost({} as any)
    expect(res).toBeFalsy()
  })
})