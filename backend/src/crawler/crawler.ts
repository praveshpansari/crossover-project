import { UrlLoaderService } from '../services/url-loader.service'
import { getValidUrl } from '../services/url-validator.service'

interface Link {
  url: string
  depth: number
}

export class Crawler {
  private readonly hostname: string
  private count: number = 0
  private readonly visited: Set<string> = new Set()

  constructor (
    private readonly urlLoader: UrlLoaderService,
    private readonly rootUrl: string,
    private readonly depth: number,
    private readonly word: string
  ) {
    this.hostname = new URL(rootUrl).hostname
  }

  getCount (): number {
    return this.count
  }

  private countWord (text: string): number {
    const regex = new RegExp(this.word, 'gi')
    const matches = text.toLocaleLowerCase().match(regex) ?? []
    return matches.length
  }

  async crawlUsingBfs (): Promise<void> {
    const queue: Link[] = [{ url: this.rootUrl, depth: 0 }]

    while (queue.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { url, depth } = queue.shift()!

      if (this.visited.has(url) || depth > this.depth) {
        continue
      }

      this.visited.add(url)

      const nextLinks = await this.processUrl(url, depth)
      queue.push(...nextLinks)
    }
  }

  private async processUrl (url: string, depth: number): Promise<Link[]> {
    const { text, links } = await this.urlLoader.loadUrlTextAndLinks(url)
    const count = this.countWord(text)
    this.count += count

    const nextDepth = depth + 1
    const nextLinks: Link[] = []

    links.forEach(link => {
      const validUrl = getValidUrl(link, this.hostname)
      if (validUrl != null && !this.visited.has(validUrl)) nextLinks.push({ url: validUrl, depth: nextDepth })
    })

    return nextLinks
  }
}
