import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const generatedThemeDir = path.join(root, '.vitepress', 'theme', 'generated')
const wpBaseUrl = 'https://www.northwestalps.com/wp-json/wp/v2'
const collections = [
  { name: 'travel', baseDir: path.join(root, 'travel') },
  { name: 'blog', baseDir: path.join(root, 'blog') }
]
const generatedFolders = ['categories', 'tags', 'authors']
const ignoredDirectories = new Set([
  'categories',
  'tags',
  'authors',
  'search',
  'node_modules',
  'travel-maps',
  '.git',
  '.vitepress',
  '.vscode',
  'build',
  'resources',
  'dist'
])

await fs.mkdir(generatedThemeDir, { recursive: true })
await Promise.all(
  collections.flatMap((collection) =>
    generatedFolders.map((folder) =>
      fs.mkdir(path.join(collection.baseDir, folder), { recursive: true })
    )
  )
)

const wpCatalog = await fetchWordPressGalleryCatalog()
const allGalleryEntries = []
const tripLabelHints = new Map(wpCatalog.tripLabels)

for (const collection of collections) {
  const postFiles = await collectMarkdownFiles(collection.baseDir)
  const normalizedPosts = []

  for (const file of postFiles) {
    const relativeFile = path.relative(root, file).replace(/\\/g, '/')
    if (path.basename(file) === 'index.md') continue
    if (/(^|\/)(categories|tags|authors|search)\//.test(relativeFile)) continue

    const source = await fs.readFile(file, 'utf8')
    const { frontmatter, body } = parseMarkdownDocument(source)
    if ((frontmatter.status || 'draft') !== 'published') continue

    const post = normalizePost(collection.name, file, frontmatter)
    normalizedPosts.push(post)

    if (collection.name === 'travel') {
      const galleries = extractGalleryEntries(post, body, wpCatalog)
      for (const gallery of galleries) {
        if (gallery.tripSlug && gallery.tripLabel) {
          tripLabelHints.set(comparableKey(gallery.tripSlug), gallery.tripLabel)
        }
      }
      allGalleryEntries.push(...galleries)
    }
  }

  const posts = dedupePosts(normalizedPosts)

  for (const mode of ['categories', 'tags', 'authors']) {
    const baseDir = path.join(collection.baseDir, mode)
    const terms = collectTerms(posts, mode)

    await cleanupGeneratedDirs(baseDir)

    for (const term of terms) {
      const dir = path.join(baseDir, term.slug)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(path.join(dir, 'index.md'), renderArchivePage(collection.name, mode, term), 'utf8')
    }
  }

  if (collection.name === 'travel') {
    const trips = collectTrips(posts, tripLabelHints)

    await fs.writeFile(path.join(collection.baseDir, 'index.md'), renderTravelHubPage(), 'utf8')

    for (const trip of trips) {
      const dir = path.join(collection.baseDir, trip.slug)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(path.join(dir, 'index.md'), renderTravelTripPage(trip), 'utf8')
    }
  }
}

const dedupedGalleryEntries = dedupeGalleryEntries(allGalleryEntries)
const galleryCollections = collectGalleryCollections(dedupedGalleryEntries, tripLabelHints)
await writeGeneratedGalleryModule(dedupedGalleryEntries, galleryCollections)
await generateGalleryPages(galleryCollections)

function normalizePost(collection, file, frontmatter) {
  const relativePath = path.relative(root, file).replace(/\\/g, '/')
  const parentSegment = path.basename(path.dirname(file))
  const slug = frontmatter.slug || path.basename(file, '.md')
  const dayNumber = Number.isFinite(Number(frontmatter.day_number))
    ? Number(frontmatter.day_number)
    : null
  const tripSlug = collection === 'travel'
    ? frontmatter.trip_slug || parentSegment
    : null
  const categories = normalizeTerms(
    frontmatter.categories ||
      (collection === 'travel'
        ? [tripSlug]
        : [frontmatter.blog_category || parentSegment || 'editoriale'])
  )
  const tags = normalizeTerms(frontmatter.tags || splitKeywords(frontmatter.seo_keywords))
  const author = normalizeAuthor(frontmatter.author_name || frontmatter.author || 'Redazione')

  return {
    title: frontmatter.title || path.basename(file, '.md'),
    excerpt: frontmatter.excerpt || '',
    collection,
    relativePath,
    aliasPaths: createAliasPaths(collection, relativePath, slug, tripSlug, dayNumber),
    link: toCleanLink(relativePath),
    slug,
    tripSlug,
    dayNumber,
    publishedDate:
      frontmatter.day_date ||
      frontmatter.published_at ||
      frontmatter.published_date ||
      frontmatter.date ||
      '',
    categories,
    tags,
    author
  }
}

function dedupePosts(posts) {
  return Array.from(
    posts.reduce((map, post) => {
      const key =
        post.collection === 'travel' && post.tripSlug && post.dayNumber != null
          ? `${post.collection}:${post.tripSlug}:${post.dayNumber}`
          : `${post.collection}:${post.relativePath}`

      const current = map.get(key)
      if (!current) {
        map.set(key, post)
        return map
      }

      const currentIsCanonical = current.slug === `day-${current.dayNumber}`
      const nextIsCanonical = post.slug === `day-${post.dayNumber}`

      if (nextIsCanonical && !currentIsCanonical) {
        map.set(key, post)
      }

      return map
    }, new Map()).values()
  )
}

function renderArchivePage(collection, mode, term) {
  const labels = {
    categories: 'Categoria',
    tags: 'Tag',
    authors: 'Autore'
  }

  return `---
title: ${yamlString(term.label)}
description: ${yamlString(`Archivio ${labels[mode].toLowerCase()} ${term.label}.`)}
layout: page
---

# ${term.label}

<ContentArchivePage collection="${collection}" mode="${mode}" term="${term.slug}" />
`
}

function renderTravelHubPage() {
  return `---
title: ${yamlString('Travel')}
description: ${yamlString('Archivio completo dei viaggi pubblicati, con hub dedicati per ogni itinerario.')}
layout: page
---

# Travel

<TravelTripsIndexPage />
`
}

function renderTravelTripPage(trip) {
  return `---
title: ${yamlString(trip.label)}
description: ${yamlString(`Diario di viaggio di ${trip.label} con indice dei giorni pubblicati.`)}
layout: page
---

# ${trip.label}

<TravelTripIndexPage trip="${trip.slug}" />
`
}

async function collectMarkdownFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = []

    for (const entry of entries) {
      const nextPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (ignoredDirectories.has(entry.name)) continue
        files.push(...await collectMarkdownFiles(nextPath))
        continue
      }

      if (entry.isFile() && nextPath.endsWith('.md')) {
        files.push(nextPath)
      }
    }

    return files
  } catch {
    return []
  }
}

function parseMarkdownDocument(source) {
  const normalizedSource = source.replace(/\r\n/g, '\n')
  const match = normalizedSource.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) {
    return { frontmatter: {}, body: normalizedSource }
  }

  return {
    frontmatter: parseFrontmatterBlock(match[1]),
    body: normalizedSource.slice(match[0].length)
  }
}

function parseFrontmatterBlock(block) {
  const lines = block.split('\n')
  const data = {}

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) continue

    const separator = trimmed.indexOf(':')
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    const rawValue = trimmed.slice(separator + 1).trim()

    if (rawValue === '|') {
      while (index + 1 < lines.length && /^\s+/.test(lines[index + 1])) index += 1
      data[key] = ''
      continue
    }

    if (!rawValue) {
      const list = []
      while (index + 1 < lines.length) {
        const nextLine = lines[index + 1]
        const itemMatch = nextLine.match(/^\s*-\s+(.*)$/)
        if (!itemMatch) break
        list.push(normalizeValue(itemMatch[1].trim()))
        index += 1
      }

      data[key] = list.length ? list : ''
      continue
    }

    data[key] = normalizeValue(rawValue)
  }

  return data
}

function normalizeValue(value) {
  if (!value) return ''
  if (value === 'null') return null
  if (value === 'true') return true
  if (value === 'false') return false
  if (/^\[(.*)\]$/.test(value)) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => item.replace(/^["']|["']$/g, ''))
  }
  if (/^["'].*["']$/.test(value)) return value.slice(1, -1)
  return value
}

function splitKeywords(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeTerms(values) {
  const list = Array.isArray(values) ? values : [values]

  return list
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .map((label) => ({ slug: slugify(label), label: prettify(label) }))
}

function normalizeAuthor(value) {
  const label = String(value || '').trim()
  if (!label) return null
  return { slug: slugify(label), label }
}

function collectTerms(posts, mode) {
  const map = new Map()

  for (const post of posts) {
    const list =
      mode === 'categories'
        ? post.categories
        : mode === 'tags'
          ? post.tags
          : post.author
            ? [post.author]
            : []

    for (const term of list) {
      if (!map.has(term.slug)) map.set(term.slug, term)
    }
  }

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, 'it'))
}

function collectTrips(posts, tripLabelHints) {
  const map = new Map()

  for (const post of posts) {
    if (post.collection !== 'travel' || !post.tripSlug) continue

    const current = map.get(post.tripSlug) || {
      slug: post.tripSlug,
      label: resolveTripLabel(post.tripSlug, tripLabelHints),
      posts: []
    }

    current.posts.push(post)
    map.set(post.tripSlug, current)
  }

  return Array.from(map.values())
    .map((trip) => ({
      ...trip,
      posts: trip.posts.sort((a, b) => {
        if (a.dayNumber != null && b.dayNumber != null) return a.dayNumber - b.dayNumber
        return a.title.localeCompare(b.title, 'it')
      })
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'it'))
}

function createAliasPaths(collection, relativePath, slug, tripSlug, dayNumber) {
  const aliases = new Set()

  if (collection === 'travel' && tripSlug && dayNumber != null) {
    aliases.add(`${pathSegment(relativePath, 0)}/${tripSlug}/day-${dayNumber}.md`)
  }

  if (slug) {
    aliases.add(replaceFileName(relativePath, `${slug}.md`))
  }

  aliases.delete(relativePath)
  return Array.from(aliases)
}

async function cleanupGeneratedDirs(baseDir) {
  const entries = await fs.readdir(baseDir, { withFileTypes: true })
  await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => fs.rm(path.join(baseDir, entry.name), { recursive: true, force: true }))
  )
}

async function fetchWordPressGalleryCatalog() {
  const [phrizmGalleries, tripCollections] = await Promise.all([
    fetchWpCollection('phrizm_gallery'),
    fetchWpCollection('gals')
  ])

  const galleriesByTitle = new Map()
  const tripLabels = new Map()

  for (const entry of phrizmGalleries) {
    if (entry.titleKey) galleriesByTitle.set(entry.titleKey, entry)
  }

  for (const collection of tripCollections) {
    if (collection.title) {
      tripLabels.set(comparableKey(collection.slug), collection.title)
      tripLabels.set(comparableKey(collection.title), collection.title)
    }
  }

  return {
    phrizmGalleries,
    tripCollections,
    galleriesByTitle,
    tripLabels
  }
}

async function fetchWpCollection(type) {
  const items = []
  const perPage = 100

  for (let page = 1; page <= 20; page += 1) {
    try {
      const url = `${wpBaseUrl}/${type}?per_page=${perPage}&page=${page}&_fields=id,slug,title,link,class_list`
      const response = await fetch(url, {
        headers: { Accept: 'application/json' }
      })

      if (!response.ok) break

      const batch = await response.json()
      if (!Array.isArray(batch) || batch.length === 0) break

      for (const item of batch) {
        const title = stripHtml(item?.title?.rendered || '')
        const classList = Array.isArray(item?.class_list) ? item.class_list : []
        const groupClass = classList.find((value) => value.startsWith('gallery_group-')) || ''
        items.push({
          id: item.id,
          slug: String(item.slug || ''),
          link: String(item.link || ''),
          title,
          titleKey: normalizeGalleryLookupKey(title),
          groupSlug: groupClass.replace(/^gallery_group-/, '')
        })
      }

      if (batch.length < perPage) break
    } catch {
      break
    }
  }

  return items
}

function extractGalleryEntries(post, body, wpCatalog) {
  const shortcodes = extractPhrizmShortcodes(body)
  if (!shortcodes.length) return []

  const items = extractGalleryItems(body)

  return shortcodes.map((shortcode, index) => {
    const wpGallery = findWordPressGallery(wpCatalog, shortcode.id)
    const title = wpGallery?.title || shortcode.id || `${post.title} Gallery`
    const gallerySlugBase = wpGallery?.slug || slugify(title) || `${post.slug}-gallery`
    const gallerySlug = index === 0 ? gallerySlugBase : `${gallerySlugBase}-${index + 1}`
    const tripSlug = post.tripSlug || wpGallery?.groupSlug || 'travel'
    const tripLabel =
      resolveTripLabel(tripSlug, wpCatalog.tripLabels) ||
      resolveTripLabel(wpGallery?.groupSlug || '', wpCatalog.tripLabels)

    return {
      key: `${post.relativePath}::${normalizeGalleryLookupKey(shortcode.id)}::${index}`,
      shortcodeId: shortcode.id,
      title,
      slug: gallerySlug,
      tripSlug,
      tripLabel,
      sourceTitle: post.title,
      sourceExcerpt: post.excerpt,
      sourceRelativePath: post.relativePath,
      sourceRelativePaths: [post.relativePath, ...post.aliasPaths],
      sourceLink: post.link,
      dayNumber: post.dayNumber,
      publishedDate: post.publishedDate,
      itemCount: items.length,
      items,
      previewItems: items.slice(0, 6),
      coverImage: items[0] || null,
      wordpress: wpGallery
        ? {
            id: wpGallery.id,
            slug: wpGallery.slug,
            link: wpGallery.link
          }
        : null,
      link: `/galleries/${tripSlug}/${gallerySlug}`
    }
  })
}

function dedupeGalleryEntries(entries) {
  const map = new Map()

  for (const entry of entries) {
    const key =
      entry.tripSlug && entry.dayNumber != null
        ? `${entry.tripSlug}::${entry.dayNumber}::${normalizeGalleryLookupKey(entry.shortcodeId)}`
        : `${entry.tripSlug}::${normalizeGalleryLookupKey(entry.shortcodeId)}`

    const current = map.get(key)
    if (!current) {
      map.set(key, { ...entry })
      continue
    }

    const preferred = preferGalleryEntry(current, entry)
    const mergedPaths = Array.from(
      new Set([...(current.sourceRelativePaths || []), ...(entry.sourceRelativePaths || [])])
    )

    map.set(key, {
      ...preferred,
      sourceRelativePaths: mergedPaths
    })
  }

  return Array.from(map.values())
}

function preferGalleryEntry(current, candidate) {
  return scoreGalleryEntry(candidate) < scoreGalleryEntry(current) ? candidate : current
}

function scoreGalleryEntry(entry) {
  let score = String(entry.sourceRelativePath || '').length
  if (entry.dayNumber != null && entry.sourceRelativePath.endsWith(`/day-${entry.dayNumber}.md`)) {
    score -= 1000
  }
  return score
}

function extractPhrizmShortcodes(body) {
  const matches = []
  const pattern = /\[phrizm_gallery\s+id=(?:"([^"]+)"|'([^']+)'|([^\]\s]+))\s*\]/g

  for (const match of body.matchAll(pattern)) {
    const id = String(match[1] || match[2] || match[3] || '').trim()
    if (!id) continue
    matches.push({ id })
  }

  return matches
}

function extractGalleryItems(body) {
  const items = []
  const seen = new Set()

  const pushItem = (url, caption = '') => {
    const src = normalizeImageUrl(url)
    if (!looksLikeImageUrl(src)) return

    const key = canonicalImageKey(src)
    if (!key || seen.has(key)) return
    seen.add(key)

    const normalizedCaption = stripHtml(caption)
    items.push({
      src,
      alt: normalizedCaption || humanizeImageName(src),
      caption: normalizedCaption || humanizeImageName(src)
    })
  }

  for (const block of body.matchAll(/<!--\s+wp:custom\/parallax\s+(\{[\s\S]*?\})\s*\/-->/g)) {
    try {
      const payload = JSON.parse(block[1])
      pushItem(payload.imageURL || payload.imageUrl || '', payload.caption || payload.alt || '')
    } catch {
      // ignore malformed JSON payloads
    }
  }

  for (const anchor of body.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    pushItem(anchor[1], anchor[2])
  }

  for (const image of body.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g)) {
    pushItem(image[1], image[2])
  }

  return items
}

function findWordPressGallery(wpCatalog, value) {
  const key = normalizeGalleryLookupKey(value)
  return wpCatalog.galleriesByTitle.get(key) || null
}

function collectGalleryCollections(entries, tripLabelHints) {
  const map = new Map()

  for (const entry of entries) {
    if (!entry.tripSlug) continue

    const current = map.get(entry.tripSlug) || {
      slug: entry.tripSlug,
      label: resolveTripLabel(entry.tripSlug, tripLabelHints),
      link: `/galleries/${entry.tripSlug}/`,
      galleries: []
    }

    current.galleries.push(entry)
    map.set(entry.tripSlug, current)
  }

  return Array.from(map.values())
    .map((collection) => {
      const galleries = collection.galleries
        .slice()
        .sort((a, b) => {
          if (a.dayNumber != null && b.dayNumber != null && a.dayNumber !== b.dayNumber) {
            return a.dayNumber - b.dayNumber
          }
          return a.title.localeCompare(b.title, 'it')
        })

      const imageCount = galleries.reduce((total, gallery) => total + gallery.itemCount, 0)

      return {
        ...collection,
        galleries,
        count: galleries.length,
        imageCount,
        coverImage: galleries.find((gallery) => gallery.coverImage)?.coverImage || null
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'it'))
}

async function writeGeneratedGalleryModule(entries, collections) {
  const payload = `export const galleryEntries = ${JSON.stringify(entries, null, 2)}\n\nexport const galleryCollections = ${JSON.stringify(collections, null, 2)}\n`
  await fs.writeFile(path.join(generatedThemeDir, 'galleries.generated.mjs'), payload, 'utf8')
}

async function generateGalleryPages(collections) {
  const galleriesBase = path.join(root, 'galleries')
  await fs.mkdir(galleriesBase, { recursive: true })

  await fs.writeFile(path.join(galleriesBase, 'index.md'), renderGalleriesHubPage(), 'utf8')

  for (const collection of collections) {
    const tripDir = path.join(galleriesBase, collection.slug)
    await fs.mkdir(tripDir, { recursive: true })

    await fs.writeFile(path.join(tripDir, 'index.md'), renderGalleryCollectionPage(collection), 'utf8')

    for (const gallery of collection.galleries) {
      await fs.writeFile(path.join(tripDir, `${gallery.slug}.md`), renderGalleryDetailPage(gallery), 'utf8')
    }
  }
}

function renderGalleriesHubPage() {
  return `---
title: ${yamlString('Gallerie')}
description: ${yamlString('Archivio visuale dei viaggi, generato automaticamente dai markdown e dagli shortcode galleria esistenti.')}
layout: page
---

# Gallerie

<GalleryCollectionsPage />
`
}

function renderGalleryCollectionPage(collection) {
  return `---
title: ${yamlString(collection.label)}
description: ${yamlString(`Gallerie fotografiche collegate al viaggio ${collection.label}.`)}
layout: page
---

# ${collection.label}

<GalleryCollectionPage trip="${collection.slug}" />
`
}

function renderGalleryDetailPage(gallery) {
  return `---
title: ${yamlString(gallery.title)}
description: ${yamlString(`Galleria fotografica collegata a ${gallery.sourceTitle}.`)}
layout: page
---

# ${gallery.title}

<GalleryDetailPage trip="${gallery.tripSlug}" gallery="${gallery.slug}" />
`
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function prettify(value) {
  return String(value)
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function prettifyTripLabel(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function replaceFileName(filePath, nextFile) {
  const parts = filePath.split('/')
  parts[parts.length - 1] = nextFile
  return parts.join('/')
}

function pathSegment(filePath, index) {
  return filePath.split('/')[index] || null
}

function yamlString(value) {
  return JSON.stringify(String(value))
}

function toCleanLink(relativePath) {
  return `/${relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`
    .replace(/\/+/g, '/')
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeImageUrl(value) {
  return String(value || '').trim()
}

function canonicalImageKey(url) {
  return String(url || '')
    .replace(/[?#].*$/, '')
    .trim()
}

function looksLikeImageUrl(value) {
  return /^https?:\/\/.+\.(avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(String(value || '').trim())
}

function humanizeImageName(url) {
  const fileName = String(url || '')
    .replace(/[?#].*$/, '')
    .split('/')
    .pop() || ''

  return fileName
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeGalleryLookupKey(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function comparableKey(value) {
  return slugify(value).replace(/-/g, '')
}

function resolveTripLabel(value, hints) {
  const raw = String(value || '').trim()
  if (!raw) return ''

  return hints.get(comparableKey(raw)) || prettifyTripLabel(raw)
}
