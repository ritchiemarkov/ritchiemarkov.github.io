const travelModules = import.meta.glob(
  [
    '../../../travel/**/*.md',
    '!../../../travel/**/index.md'
  ],
  {
    eager: true,
    import: '__pageData'
  }
)

const normalizedPosts = Object.values(travelModules)
  .map((pageData) => normalizePost(pageData))
  .filter((post) => post.status === 'published')

const dedupedPosts = Array.from(
  normalizedPosts.reduce((map, post) => {
    const key = post.tripSlug && post.dayNumber != null
      ? `${post.tripSlug}:${post.dayNumber}`
      : post.relativePath

    const current = map.get(key)

    if (!current || shouldReplace(current, post)) {
      map.set(key, post)
    }

    return map
  }, new Map()).values()
).sort(sortPosts)

const postsByRelativePath = new Map(
  dedupedPosts.flatMap((post) => [
    [post.relativePath, post],
    ...post.aliasPaths.map((path) => [path, post])
  ])
)

export const travelPosts = dedupedPosts

export function getTravelPost(relativePath = '') {
  return postsByRelativePath.get(relativePath) || null
}

export function getTravelTerms(mode) {
  const counts = new Map()

  for (const post of dedupedPosts) {
    const terms = getPostTerms(post, mode)
    for (const term of terms) {
      const entry = counts.get(term.slug) || { ...term, count: 0, posts: [] }
      entry.count += 1
      entry.posts.push(post)
      counts.set(term.slug, entry)
    }
  }

  return Array.from(counts.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return a.label.localeCompare(b.label, 'it')
  })
}

export function getPostTerms(post, mode) {
  if (!post) return []
  if (mode === 'categories') return post.categories
  if (mode === 'tags') return post.tags
  if (mode === 'authors') return post.author ? [post.author] : []
  return []
}

function normalizePost(pageData) {
  const frontmatter = pageData.frontmatter || {}
  const relativePath = pageData.relativePath
  const rawSlug = frontmatter.slug || fileNameFromPath(relativePath)
  const tripSlug = frontmatter.trip_slug || pathSegment(relativePath, 1) || null
  const categories = normalizeTerms(frontmatter.categories || (tripSlug ? [tripSlug] : []))
  const tags = normalizeTerms(frontmatter.tags || splitKeywords(frontmatter.seo_keywords))
  const author = normalizeAuthor(frontmatter)
  const link = toCleanLink(relativePath)

  return {
    title: frontmatter.title || pageData.title || rawSlug,
    excerpt: frontmatter.excerpt || pageData.description || '',
    slug: rawSlug,
    relativePath,
    aliasPaths: createAliasPaths(relativePath, rawSlug, tripSlug, frontmatter.day_number),
    link,
    tripSlug,
    day: frontmatter.day || null,
    dayNumber: Number.isFinite(Number(frontmatter.day_number))
      ? Number(frontmatter.day_number)
      : null,
    dayDate: frontmatter.day_date || null,
    status: frontmatter.status || 'draft',
    menuOrder: Number.isFinite(Number(frontmatter.menu_order))
      ? Number(frontmatter.menu_order)
      : 999,
    categories,
    tags,
    author,
    seo: {
      title: frontmatter.seo_title || frontmatter.title || pageData.title || '',
      description: frontmatter.seo_description || frontmatter.excerpt || pageData.description || '',
      keywords: frontmatter.seo_keywords || '',
      canonical: frontmatter.seo_canonical || '',
      robots: frontmatter.seo_robots || '',
      ogTitle: frontmatter.seo_og_title || '',
      ogDescription: frontmatter.seo_og_description || '',
      ogImage: frontmatter.seo_og_image || frontmatter.seo_image || frontmatter.featured_image || '',
      twitterTitle: frontmatter.seo_twitter_title || '',
      twitterDescription: frontmatter.seo_twitter_description || '',
      twitterImage: frontmatter.seo_twitter_image || frontmatter.seo_image || frontmatter.featured_image || ''
    }
  }
}

function normalizeTerms(input) {
  const values = Array.isArray(input) ? input : [input]

  return values
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .map((value) => ({
      slug: slugify(value),
      label: prettifyLabel(value)
    }))
}

function normalizeAuthor(frontmatter) {
  const raw = frontmatter.author_name || frontmatter.author || (frontmatter.trip_slug ? 'Redazione' : '')
  if (!raw) return null

  return {
    slug: slugify(raw),
    label: String(raw).trim()
  }
}

function splitKeywords(value) {
  if (!value) return []
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function createAliasPaths(relativePath, slug, tripSlug, dayNumber) {
  const aliases = new Set()

  if (tripSlug && dayNumber != null) {
    aliases.add(`${pathSegment(relativePath, 0)}/${tripSlug}/day-${dayNumber}.md`)
  }

  if (slug) {
    aliases.add(replaceFileName(relativePath, `${slug}.md`))
  }

  aliases.delete(relativePath)
  return Array.from(aliases)
}

function toCleanLink(relativePath) {
  return `/${relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`
    .replace(/\/+/g, '/')
}

function shouldReplace(current, candidate) {
  const currentIsCanonical = isCanonicalDaySlug(current.slug, current.dayNumber)
  const candidateIsCanonical = isCanonicalDaySlug(candidate.slug, candidate.dayNumber)

  if (candidateIsCanonical !== currentIsCanonical) {
    return candidateIsCanonical
  }

  return candidate.link.length < current.link.length
}

function isCanonicalDaySlug(slug, dayNumber) {
  return dayNumber != null && slug === `day-${dayNumber}`
}

function sortPosts(a, b) {
  if (a.tripSlug !== b.tripSlug) {
    return String(a.tripSlug || '').localeCompare(String(b.tripSlug || ''), 'it')
  }

  if (a.dayNumber != null && b.dayNumber != null && a.dayNumber !== b.dayNumber) {
    return a.dayNumber - b.dayNumber
  }

  if (a.menuOrder !== b.menuOrder) return a.menuOrder - b.menuOrder
  return a.title.localeCompare(b.title, 'it')
}

function fileNameFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

function replaceFileName(path, nextFile) {
  const parts = path.split('/')
  parts[parts.length - 1] = nextFile
  return parts.join('/')
}

function pathSegment(path, index) {
  return path.split('/')[index] || null
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function prettifyLabel(value) {
  const raw = String(value).trim()
  if (!raw) return ''

  return raw
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
