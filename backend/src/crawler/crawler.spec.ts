import { mock } from 'jest-mock-extended'

import { UrlLoaderService } from '../services/url-loader.service'
import { Crawler } from './crawler'

const urlLoader = mock<UrlLoaderService>()
const testUrl = 'https://test.com'
const pageContent = 'This is Kayako Kayako'

describe('Crawler', () => {
  afterEach(() => {
    urlLoader.loadUrlTextAndLinks.mockRestore()
  })

  it('should return count of words', async () => {
    // given
    const instance = new Crawler(urlLoader, testUrl, 2, 'kayako')
    urlLoader.loadUrlTextAndLinks.mockResolvedValue({ text: pageContent, links: [] })

    // when
    await instance.crawlUsingBfs()

    // then
    expect(instance.getCount()).toBe(2)
  })

  it('should return count of words from 2 depth', async () => {
    // given
    const instance = new Crawler(urlLoader, testUrl, 2, 'kayako')
    urlLoader.loadUrlTextAndLinks.mockResolvedValueOnce({ text: pageContent, links: [testUrl + '/about'] })
    urlLoader.loadUrlTextAndLinks.mockResolvedValueOnce({ text: pageContent, links: [testUrl + '/contact'] })
    urlLoader.loadUrlTextAndLinks.mockResolvedValueOnce({ text: pageContent, links: [] })

    // when
    await instance.crawlUsingBfs()

    // then
    expect(instance.getCount()).toBe(6)
  })

  it('should return correct count of words from 3 depth', async () => {
    // given
    const instance = new Crawler(urlLoader, testUrl, 2, 'kayako')
    urlLoader.loadUrlTextAndLinks.mockResolvedValueOnce({ text: pageContent, links: [testUrl + '/about'] })
    urlLoader.loadUrlTextAndLinks.mockResolvedValueOnce({ text: pageContent, links: [testUrl + '/contact'] })
    urlLoader.loadUrlTextAndLinks.mockResolvedValueOnce({ text: pageContent, links: [testUrl + '/items'] })
    urlLoader.loadUrlTextAndLinks.mockResolvedValueOnce({ text: pageContent, links: [] })

    // when
    await instance.crawlUsingBfs()

    // then
    expect(instance.getCount()).toBe(6)
  })

  it('should ignore incorrect hostname', async () => {
    // given
    const instance = new Crawler(urlLoader, testUrl, 2, 'kayako')
    urlLoader.loadUrlTextAndLinks.mockResolvedValueOnce({ text: pageContent, links: ['http://kayako.com/'] })

    // when
    await instance.crawlUsingBfs()

    // then
    expect(instance.getCount()).toBe(2)
  })

  it('should ignore invalid urls', async () => {
    // given
    const instance = new Crawler(urlLoader, testUrl, 2, 'kayako')
    urlLoader.loadUrlTextAndLinks.mockResolvedValueOnce({ text: pageContent, links: [testUrl + '/rtech.pdf', 'mailto:link'] })

    // when
    await instance.crawlUsingBfs()

    // then
    expect(instance.getCount()).toBe(2)
  })
}
)
