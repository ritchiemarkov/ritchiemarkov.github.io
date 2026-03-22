import { isActive } from './shared'

function ensureStartingSlash(path) {
  return path.startsWith('/') ? path : `/${path}`
}

function addBase(items, inheritedBase) {
  return [...items].map((sourceItem) => {
    const item = { ...sourceItem }
    const base = item.base || inheritedBase

    if (base && item.link) {
      item.link = base + item.link.replace(/^\//, base.endsWith('/') ? '' : '/')
    }

    if (item.items) {
      item.items = addBase(item.items, base)
    }

    return item
  })
}

export function getSidebar(config, path) {
  if (Array.isArray(config)) return addBase(config)
  if (!config) return []

  const normalizedPath = ensureStartingSlash(path)
  const dir = Object.keys(config)
    .sort((a, b) => b.split('/').length - a.split('/').length)
    .find((key) => normalizedPath.startsWith(ensureStartingSlash(key)))

  const sidebar = dir ? config[dir] : []

  return Array.isArray(sidebar)
    ? addBase(sidebar)
    : addBase(sidebar.items, sidebar.base)
}

export function getSidebarGroups(sidebar) {
  const groups = []
  let lastGroupIndex = 0

  for (const item of sidebar) {
    if (item.items) {
      lastGroupIndex = groups.push(item)
      continue
    }

    if (!groups[lastGroupIndex]) {
      groups.push({ items: [] })
    }

    groups[lastGroupIndex].items.push(item)
  }

  return groups
}

export function getFlatSideBarLinks(sidebar) {
  const links = []

  function collect(items) {
    for (const item of items) {
      if (item.text && item.link) {
        links.push({
          text: item.text,
          link: item.link,
          docFooterText: item.docFooterText
        })
      }

      if (item.items) {
        collect(item.items)
      }
    }
  }

  collect(sidebar)

  return links
}

export function hasActiveLink(path, items) {
  if (Array.isArray(items)) {
    return items.some((item) => hasActiveLink(path, item))
  }

  return isActive(path, items.link)
    ? true
    : itemHasActiveChildren(path, items)
}

function itemHasActiveChildren(path, item) {
  return item.items ? hasActiveLink(path, item.items) : false
}
