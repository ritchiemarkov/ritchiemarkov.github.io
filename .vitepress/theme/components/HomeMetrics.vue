<script setup>
import { computed } from 'vue'

import { blogPosts, getContentTerms, travelPosts } from '../data/content'

const metrics = computed(() => {
  const dates = [...travelPosts, ...blogPosts]
    .map((post) => post.publishedDate)
    .filter(Boolean)
    .sort()

  const categories =
    getContentTerms('travel', 'categories').length + getContentTerms('blog', 'categories').length
  const tags = getContentTerms('travel', 'tags').length + getContentTerms('blog', 'tags').length
  const authors =
    getContentTerms('travel', 'authors').length + getContentTerms('blog', 'authors').length
  const years = dates.length ? `${dates[0].slice(0, 4)} -> ${dates[dates.length - 1].slice(0, 4)}` : 'Archivio attivo'

  return [
    {
      label: 'Contenuti pubblicati',
      value: `${travelPosts.length} travel / ${blogPosts.length} blog`,
      copy: 'Travel e blog convivono nello stesso sistema editoriale ma con landing e archive separati.'
    },
    {
      label: 'Archivi',
      value: `${categories} categorie / ${tags} tag`,
      copy: 'Categorie, tag e autori vengono ricavati dai markdown e trasformati in pagine statiche.'
    },
    {
      label: 'Copertura',
      value: authors > 1 ? `${authors} autori · ${years}` : years,
      copy: 'Una struttura da magazine statico: viaggi, articoli, gallerie, mappe e pagine istituzionali.'
    }
  ]
})
</script>

<template>
  <section class="mx-auto mt-8 max-w-6xl px-6 pb-12">
    <div class="grid gap-4 md:grid-cols-3">
      <Card
        v-for="item in metrics"
        :key="item.label"
        class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur"
      >
        <CardHeader>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {{ item.label }}
          </p>
          <CardTitle>{{ item.value }}</CardTitle>
          <CardDescription>{{ item.copy }}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  </section>
</template>
