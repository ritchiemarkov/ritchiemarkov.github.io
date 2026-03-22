import { galleryCollections, galleryEntries } from '../generated/galleries.generated.mjs'

const collections = Array.isArray(galleryCollections) ? galleryCollections : []
const entries = Array.isArray(galleryEntries) ? galleryEntries : []

const galleryByTripAndSlug = new Map(
  entries.map((entry) => [`${entry.tripSlug}::${entry.slug}`, entry])
)

const galleryBySourceAndId = new Map(
  entries.flatMap((entry) =>
    (Array.isArray(entry.sourceRelativePaths) ? entry.sourceRelativePaths : [entry.sourceRelativePath])
      .filter(Boolean)
      .map((relativePath) => [
        `${relativePath}::${normalizeGalleryKey(entry.shortcodeId)}`,
        entry
      ])
  )
)

const collectionByTrip = new Map(collections.map((collection) => [collection.slug, collection]))

export function getGalleryCollections() {
  return collections
}

export function getGalleryCollection(trip = '') {
  return collectionByTrip.get(String(trip || '').trim()) || null
}

export function getGalleryEntry(trip = '', slug = '') {
  return galleryByTripAndSlug.get(`${String(trip || '').trim()}::${String(slug || '').trim()}`) || null
}

export function getInlineGallery(relativePath = '', galleryId = '') {
  return galleryBySourceAndId.get(
    `${String(relativePath || '').trim()}::${normalizeGalleryKey(galleryId)}`
  ) || null
}

export function normalizeGalleryKey(value = '') {
  return String(value)
    .normalize('NFKC')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}
