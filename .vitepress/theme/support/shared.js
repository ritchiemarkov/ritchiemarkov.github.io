const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i
const HASH_RE = /#.*$/
const HASH_OR_QUERY_RE = /[?#].*$/
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/

export function normalize(path) {
  return decodeURI(path)
    .replace(HASH_OR_QUERY_RE, '')
    .replace(INDEX_OR_EXT_RE, '$1')
}

export function isActive(currentPath, matchPath, asRegex = false) {
  if (matchPath === undefined) return false

  const normalizedCurrentPath = normalize(`/${currentPath}`)

  if (asRegex) {
    return new RegExp(matchPath).test(normalizedCurrentPath)
  }

  if (normalize(matchPath) !== normalizedCurrentPath) return false

  const hashMatch = matchPath.match(HASH_RE)
  if (hashMatch) {
    return typeof window !== 'undefined' ? window.location.hash === hashMatch[0] : false
  }

  return true
}

export function isExternal(path = '') {
  return EXTERNAL_URL_RE.test(path)
}
