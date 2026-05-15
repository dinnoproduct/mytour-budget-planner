import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { BlogService } from './BlogService'

vi.mock('axios')

// BlogService.stripHTML uses document.createElement which is not available in node env.
// Stub document globally so the method can run.
const mockDiv = { innerHTML: '', textContent: 'stripped text', innerText: '' }

describe('BlogService', () => {
  const createMock = vi.mocked(axios.create)
  const responseUse = vi.fn()
  const get = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('document', { createElement: () => ({ ...mockDiv }) })
    createMock.mockReturnValue({
      get,
      interceptors: { response: { use: responseUse } },
    } as never)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates client with Medium RSS feed base URL', () => {
    new BlogService()
    expect(createMock).toHaveBeenCalledWith({ baseURL: 'https://api.rss2json.com/v1/api.json' })
  })

  it('requests feed with rss_url param pointing to mytour medium blog', async () => {
    get.mockResolvedValueOnce({ data: { status: 'ok', items: [] } })
    const service = new BlogService()
    await service.getBlogs()
    expect(get).toHaveBeenCalledWith('', {
      params: { rss_url: 'https://medium.com/feed/@mytour.am' },
    })
  })

  it('returns transformed blog posts when feed responds with ok status', async () => {
    const items = [
      {
        title: 'Post 1',
        description: '<p>Hello world</p>',
        pubDate: '2024-01-15 10:00:00',
        content: '<img src="https://img.example.com/photo.jpg" />',
        link: 'https://medium.com/post-1',
      },
    ]
    get.mockResolvedValueOnce({ data: { status: 'ok', items } })
    const service = new BlogService()
    const result = await service.getBlogs()

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Post 1')
    expect(result[0].imageUrl).toBe('https://img.example.com/photo.jpg')
    expect(result[0].link).toBe('https://medium.com/post-1')
    expect(result[0].date).toBeInstanceOf(Date)
  })

  it('uses placeholder image when content contains no img tag', async () => {
    const items = [
      {
        title: 'No image',
        description: 'text',
        pubDate: '2024-01-01 00:00:00',
        content: '<p>no image here</p>',
        link: 'https://medium.com/no-image',
      },
    ]
    get.mockResolvedValueOnce({ data: { status: 'ok', items } })
    const service = new BlogService()
    const result = await service.getBlogs()

    expect(result[0].imageUrl).toBe('https://via.placeholder.com/800x400')
  })

  it('returns empty array when feed status is not ok', async () => {
    get.mockResolvedValueOnce({ data: { status: 'error', items: null } })
    const service = new BlogService()
    const result = await service.getBlogs()
    expect(result).toEqual([])
  })

  it('returns empty array when items are missing', async () => {
    get.mockResolvedValueOnce({ data: { status: 'ok', items: null } })
    const service = new BlogService()
    const result = await service.getBlogs()
    expect(result).toEqual([])
  })

  it('returns empty array and swallows error on request failure', async () => {
    get.mockRejectedValueOnce(new Error('timeout'))
    const service = new BlogService()
    const result = await service.getBlogs()
    expect(result).toEqual([])
  })
})
