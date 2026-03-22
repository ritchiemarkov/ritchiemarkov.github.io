const ignoreRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/

export function resolveTitle(theme) {
  return (
    (typeof theme.outline === 'object' &&
      !Array.isArray(theme.outline) &&
      theme.outline.label) ||
    theme.outlineTitle ||
    'On this page'
  )
}

export function getHeaders(range) {
  const selector = [
    '.vp-doc h1',
    '.vp-doc h2',
    '.vp-doc h3',
    '.vp-doc h4',
    '.vp-doc h5',
    '.vp-doc h6',
    '.VPDoc h1',
    '.VPDoc h2',
    '.VPDoc h3',
    '.VPDoc h4',
    '.VPDoc h5',
    '.VPDoc h6'
  ].join(', ')

  const headers = [...document.querySelectorAll(selector)]
    .filter((element) => element.id && element.hasChildNodes())
    .map((element) => ({
      title: serializeHeader(element),
      link: `#${element.id}`,
      level: Number(element.tagName[1])
    }))

  return resolveHeaders(headers, range)
}

export function resolveHeaders(headers, range) {
  if (range === false) return []

  const levelsRange =
    (typeof range === 'object' && !Array.isArray(range) ? range.level : range) || 2

  const [high, low] =
    typeof levelsRange === 'number'
      ? [levelsRange, levelsRange]
      : levelsRange === 'deep'
        ? [2, 6]
        : levelsRange

  return buildTree(headers, high, low)
}

function serializeHeader(header) {
  let content = ''

  for (const node of header.childNodes) {
    if (node.nodeType === 1) {
      if (ignoreRE.test(node.className)) continue
      content += node.textContent
      continue
    }

    if (node.nodeType === 3) {
      content += node.textContent
    }
  }

  return content.trim()
}

function buildTree(data, min, max) {
  const result = []
  const stack = []

  data.forEach((item) => {
    const node = { ...item, children: [] }
    let parent = stack[stack.length - 1]

    while (parent && parent.level >= node.level) {
      stack.pop()
      parent = stack[stack.length - 1]
    }

    if (node.level > max || node.level < min) return

    if (parent) {
      parent.children.push(node)
    } else {
      result.push(node)
    }

    stack.push(node)
  })

  return result
}
