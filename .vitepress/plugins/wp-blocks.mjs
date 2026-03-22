/**
 * markdown-it plugin that converts WordPress block comments
 * and selected legacy shortcodes into Vue component tags at render time.
 *
 * Supported blocks:
 *   <!-- wp:tuodominio/informazioni {JSON} /-->  →  <InfoBox ...props />
 *   <!-- wp:custom/parallax {JSON} /-->          →  <ParallaxImage ...props />
 *   [phrizm_gallery id="Japan Day 1"]           →  <PhrizmGallery gallery-id="Japan Day 1" />
 */
export function wpBlocksPlugin(md) {
  md.block.ruler.before('paragraph', 'phrizm_gallery_block', (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine]
    const end = state.eMarks[startLine]
    const line = state.src.slice(start, end).trim()
    const match = line.match(/^\[phrizm_gallery\s+id=(?:"([^"]+)"|'([^']+)'|([^\]\s]+))\s*\]$/)

    if (!match) return false
    if (silent) return true

    const galleryId = escapeHtmlAttr(match[1] || match[2] || match[3] || '')
    const token = state.push('html_block', '', 0)
    token.content = `<PhrizmGallery gallery-id="${galleryId}" />\n`
    state.line = startLine + 1
    return true
  })

  const defaultHtmlBlock = md.renderer.rules.html_block
    || ((tokens, idx) => tokens[idx].content)

  md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const converted = convertWpBlock(token.content)
    if (converted) return converted
    return defaultHtmlBlock(tokens, idx, options, env, self)
  }

  const defaultHtmlInline = md.renderer.rules.html_inline
    || ((tokens, idx) => tokens[idx].content)

  md.renderer.rules.html_inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const converted = convertWpBlock(token.content)
    if (converted) return converted
    return defaultHtmlInline(tokens, idx, options, env, self)
  }
}

const blockMap = {
  'wp:tuodominio/informazioni': 'InfoBox',
  'wp:custom/informazioni': 'InfoBox',
  'wp:custom/parallax': 'ParallaxImage'
}

function convertWpBlock(raw) {
  const trimmed = raw.trim()
  const match = trimmed.match(
    /^<!--\s+(wp:[a-z0-9_/-]+)\s+(\{[\s\S]*?\})\s*\/?-->$/
  )
  if (!match) return null

  const blockName = match[1]
  const component = blockMap[blockName]
  if (!component) return null

  let props
  try {
    props = JSON.parse(match[2])
  } catch {
    return null
  }

  const attrs = Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'number') return `:${key}="${value}"`
      if (typeof value === 'boolean') return `:${key}="${value}"`
      const escaped = String(value).replace(/"/g, '&quot;')
      return `${key}="${escaped}"`
    })
    .join(' ')

  return `<${component} ${attrs} />\n`
}

function escapeHtmlAttr(value) {
  return String(value).replace(/"/g, '&quot;')
}
