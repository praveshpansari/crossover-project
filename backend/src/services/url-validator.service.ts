export function getValidUrl (url: string, hostname: string): string | null {
  const parsedUrl = new URL(url)

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') { return null }

  const unhashedUrl = getUnhashedUrl(parsedUrl)
  return isValidUrl(unhashedUrl, hostname) ? unhashedUrl.toString() : null
}

function getUnhashedUrl (url: URL): URL {
  url.hash = ''
  return url
}

function isValidUrl (url: URL, hostname: string): boolean {
  return hostname.includes(url.hostname)
}
