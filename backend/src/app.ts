
import { Crawler } from './crawler/crawler.js'
import { UrlLoaderService } from './services/url-loader.service.js'
import { Command } from 'commander'

interface AppParameters {
  url: string
  depth: number
  word: string
}

export const DEFAULT_URL = 'https://www.kayako.com/'
export const DEFAULT_DEPTH = 2
export const DEFAULT_WORD = 'kayako'

export class App {
  /* istanbul ignore next */
  constructor (private readonly urlLoader: UrlLoaderService, private readonly command = new Command()) {
  }

  async run (): Promise<void> {
    const appParameters = this.parseCli()

    await this.process(appParameters)
  }

  async process (appParameters: AppParameters): Promise<void> {
    const crawler = new Crawler(this.urlLoader, appParameters.url, appParameters.depth, appParameters.word)
    await crawler.crawlUsingBfs()

    console.log(`Found ${crawler.getCount()} instances of '${appParameters.word}' in the body of the page`)
  }

  parseCli (argv: readonly string[] = process.argv): AppParameters {
    this.command
      .requiredOption('-u, --url <url>', 'URL to load', DEFAULT_URL)
      .requiredOption('-d, --depth <depth>', 'Depth to search', DEFAULT_DEPTH.toString())
      .requiredOption('-w, --word <word>', 'Word to search', DEFAULT_WORD)

    this.command.parse(argv)
    const options = this.command.opts()

    return { url: options.url, depth: Number(options.depth), word: options.word }
  }
}
