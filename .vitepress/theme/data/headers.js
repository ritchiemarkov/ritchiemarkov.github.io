const markdownModules = import.meta.glob(
  [
    '../../../*.md',
    '../../../**/*.md',
    '!../../../node_modules/**',
    '!../../../.vitepress/**'
  ],
  {
    eager: true,
    import: 'default',
    query: '?raw'
  }
)

const headersByPath = Object.fromEntries(
  Object.entries(markdownModules).map(([filePath, source]) => [
    toRelativePath(filePath),
    extractHeaders(source)
  ])
)

export function getPageHeaders(relativePath = '') {
  return headersByPath[relativePath] || []
}

function toRelativePath(filePath) {
  return filePath
    .replace(/^.*\/Desktop\/Vitepress\//, '')
    .replace(/^(\.\.\/)+/, '')
}

function extractHeaders(source) {
  const slugCounts = new Map()

  return stripMarkdownNoise(source)
    .split('\n')
    .map((line) => line.match(/^(#{2,6})\s+(.+?)\s*$/))
    .filter(Boolean)
    .map(([, hashes, rawTitle]) => {
      const title = normalizeTitle(rawTitle)
      return {
        title,
        link: `#${slugify(title, slugCounts)}`,
        level: hashes.length
      }
    })
}

function stripMarkdownNoise(source) {
  return source
    .replace(/^---[\s\S]*?^---\s*/m, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
}

function normalizeTitle(value) {
  return value
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function slugify(value, slugCounts) {
  const base = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-')

  const count = slugCounts.get(base) || 0
  slugCounts.set(base, count + 1)

  return count === 0 ? base : `${base}-${count}`
}
