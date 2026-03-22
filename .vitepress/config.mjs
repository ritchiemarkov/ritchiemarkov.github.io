import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'
import { wpBlocksPlugin } from './plugins/wp-blocks.mjs'

function resolveSeoImage(frontmatter = {}) {
  return (
    frontmatter.seo_og_image ||
    frontmatter.seo_twitter_image ||
    frontmatter.seo_image ||
    frontmatter.featured_image ||
    ''
  )
}

function prettifyLabel(value = '') {
  return String(value)
    .trim()
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getTravelTripSidebarItems() {
  const travelRoot = fileURLToPath(new URL('../travel', import.meta.url))
  const ignored = new Set([
    'authors',
    'categories',
    'tags',
    'search',
    'node_modules',
    'travel-maps',
    '.DS_Store'
  ])

  return readdirSync(travelRoot)
    .filter((entry) => !ignored.has(entry))
    .filter((entry) => {
      const fullPath = `${travelRoot}/${entry}`
      try {
        return statSync(fullPath).isDirectory()
      } catch {
        return false
      }
    })
    .map((slug) => ({
      text: prettifyLabel(slug),
      link: `/travel/${slug}/`
    }))
    .sort((a, b) => a.text.localeCompare(b.text, 'it'))
}

function getSectionIndexSidebarItems(section, ignored = []) {
  const sectionRoot = fileURLToPath(new URL(`../${section}`, import.meta.url))
  const ignoredSet = new Set(['.DS_Store', ...ignored])

  return readdirSync(sectionRoot)
    .filter((entry) => !ignoredSet.has(entry))
    .filter((entry) => {
      const fullPath = `${sectionRoot}/${entry}`
      try {
        return statSync(fullPath).isDirectory()
      } catch {
        return false
      }
    })
    .map((slug) => ({
      text: readMarkdownTitle(`${sectionRoot}/${slug}/index.md`) || prettifyLabel(slug),
      link: `/${section}/${slug}/`
    }))
    .sort((a, b) => a.text.localeCompare(b.text, 'it'))
}

function readMarkdownTitle(filePath) {
  try {
    const source = readFileSync(filePath, 'utf8')
    const match = source.match(/^---[\s\S]*?^\s*title:\s*["']?(.+?)["']?\s*$/m)
    return match?.[1]?.trim() || ''
  } catch {
    return ''
  }
}

const travelTripSidebarItems = getTravelTripSidebarItems()
const gallerySidebarItems = getSectionIndexSidebarItems('galleries')

export default defineConfig({
  lang: 'it-IT',
  title: 'Northwest Alps Journal',
  description: 'Viaggi, gallerie, mappe e articoli editoriali in un magazine statico costruito con VitePress.',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  transformHead({ pageData }) {
    const frontmatter = pageData.frontmatter || {}
    const relativePath = pageData.relativePath || ''
    const isArticle =
      /^(travel|blog)\//.test(relativePath) &&
      !/\/index\.md$/.test(relativePath) &&
      frontmatter.layout !== 'page'
    const title = frontmatter.seo_title || pageData.title || 'Northwest Alps Journal'
    const description =
      frontmatter.seo_description ||
      pageData.description ||
      'Diari di viaggio, articoli editoriali e archivi navigabili.'
    const ogTitle = frontmatter.seo_og_title || title
    const ogDescription = frontmatter.seo_og_description || description
    const twitterTitle = frontmatter.seo_twitter_title || ogTitle
    const twitterDescription = frontmatter.seo_twitter_description || ogDescription
    const image = resolveSeoImage(frontmatter)
    const head = [
      ['meta', { name: 'description', content: description }],
      ['meta', { property: 'og:title', content: ogTitle }],
      ['meta', { property: 'og:description', content: ogDescription }],
      ['meta', { property: 'og:type', content: isArticle ? 'article' : 'website' }],
      ['meta', { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' }],
      ['meta', { name: 'twitter:title', content: twitterTitle }],
      ['meta', { name: 'twitter:description', content: twitterDescription }]
    ]

    if (frontmatter.seo_keywords) {
      head.push(['meta', { name: 'keywords', content: frontmatter.seo_keywords }])
    }

    if (frontmatter.seo_robots) {
      head.push(['meta', { name: 'robots', content: frontmatter.seo_robots }])
    }

    if (frontmatter.seo_canonical) {
      head.push(['link', { rel: 'canonical', href: frontmatter.seo_canonical }])
      head.push(['meta', { property: 'og:url', content: frontmatter.seo_canonical }])
    }

    if (frontmatter.author || frontmatter.author_name) {
      const author = frontmatter.author_name || frontmatter.author
      head.push(['meta', { name: 'author', content: author }])
      head.push(['meta', { property: 'article:author', content: author }])
    }

    const publishedTime =
      frontmatter.day_date ||
      frontmatter.published_at ||
      frontmatter.published_date ||
      frontmatter.date

    if (publishedTime) {
      head.push(['meta', { property: 'article:published_time', content: publishedTime }])
    }

    if (image) {
      head.push(['meta', { property: 'og:image', content: image }])
      head.push(['meta', { name: 'twitter:image', content: image }])
    }

    return head
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('..', import.meta.url))
      }
    }
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    config(md) {
      md.use(wpBlocksPlugin)
    }
  },
  head: [
    ['meta', { name: 'theme-color', content: '#d97706' }]
  ],
  themeConfig: {
    siteTitle: 'Northwest Alps Journal',
    homeBadge: 'Travel + editorial',
    navBadge: 'Magazine statico',
    navline: 'viaggi, gallerie, mappe, blog',
    navCta: {
      text: 'Vai ai viaggi',
      link: '/travel/alaska/'
    },
    navSecondaryCta: {
      text: 'Apri il blog',
      link: '/blog/'
    },
    searchLabel: 'Cerca nel sito',
    searchPlaceholder: 'Cerca per viaggio, articolo, luogo, tag o categoria',
    searchSuggestions: ['alaska', 'roadbook', 'gallerie', 'blog'],
    returnToTopLabel: 'Torna in alto',
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Travel', link: '/travel/' },
      { text: 'Gallerie', link: '/galleries/' },
      { text: 'Mappe', link: '/maps/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'About', link: '/about/' },
      { text: 'Contacts', link: '/contacts/' }
    ],
    sidebar: {
      '/travel/': [
        {
          text: 'Travel hub',
          items: [
            { text: 'Overview', link: '/travel/' },
            { text: 'Search', link: '/travel/search/' },
            { text: 'Categorie', link: '/travel/categories/' },
            { text: 'Tag', link: '/travel/tags/' },
            { text: 'Autori', link: '/travel/authors/' }
          ]
        },
        {
          text: 'Viaggi',
          items: travelTripSidebarItems
        }
      ],
      '/blog/': [
        {
          text: 'Blog hub',
          items: [
            { text: 'Overview', link: '/blog/' },
            { text: 'Search', link: '/blog/search/' },
            { text: 'Categorie', link: '/blog/categories/' },
            { text: 'Tag', link: '/blog/tags/' },
            { text: 'Autori', link: '/blog/authors/' }
          ]
        }
      ],
      '/galleries/': [
        {
          text: 'Gallerie',
          items: [
            { text: 'Overview', link: '/galleries/' },
            ...gallerySidebarItems
          ]
        }
      ],
      '/maps/': [
        {
          text: 'Mappe',
          items: [
            { text: 'Overview', link: '/maps/' },
            { text: 'Alaska', link: '/maps/alaska/' }
          ]
        }
      ]
    },
    outline: {
      level: [2, 3],
      label: 'In questa pagina'
    },
    docFooter: {
      prev: 'Pagina precedente',
      next: 'Pagina successiva'
    },
    footer: {
      message: 'Un magazine statico per viaggi e articoli editoriali, con archivi automatici generati dai markdown.',
      copyright: 'Northwest Alps Journal',
      badges: ['Travel + Blog', 'Categorie, tag, autori']
    }
  }
})
