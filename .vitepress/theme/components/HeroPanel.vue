<script setup>
import { CalendarRange, MapPinned, MoveRight, Tags } from 'lucide-vue-next'
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { getCollectionPosts, getContentTerms, getLatestPosts } from '../data/content'

const travelPosts = getCollectionPosts('travel')
const alaskaPosts = travelPosts.filter((post) => post.tripSlug === 'alaska')
const firstPost = alaskaPosts[0] || travelPosts[0]
const topTag = getContentTerms('travel', 'tags')[0]
const latestPost = alaskaPosts[alaskaPosts.length - 1] || getLatestPosts('travel', 1)[0]
const latestBlog = getLatestPosts('blog', 1)[0]

const stackItems = computed(() => [
  {
    icon: MapPinned,
    label: 'Itinerario',
    value: `${alaskaPosts.length || travelPosts.length} tappe pubblicate`
  },
  {
    icon: CalendarRange,
    label: 'Inizio viaggio',
    value: firstPost?.day || firstPost?.title || 'Prima tappa disponibile'
  },
  {
    icon: Tags,
    label: 'Tag piu usato',
    value: topTag ? `${topTag.label} · ${topTag.count}` : 'Tag in aggiornamento'
  }
])
</script>

<template>
  <div class="mx-auto w-full max-w-[32rem]">
    <div class="mb-4 flex items-center justify-between">
      <Badge variant="outline">Viaggio in evidenza</Badge>
      <div class="flex gap-1.5" aria-hidden="true">
        <span class="size-[0.7rem] rounded-full bg-[rgba(217,119,6,0.3)]" />
        <span class="size-[0.7rem] rounded-full bg-[rgba(217,119,6,0.3)]" />
        <span class="size-[0.7rem] rounded-full bg-[rgba(217,119,6,0.3)]" />
      </div>
    </div>

    <Card class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <CardHeader>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Travel
        </p>
        <CardTitle class="text-2xl">Alaska</CardTitle>
        <CardDescription>
          Diario di viaggio con tappe giornaliere, archivi tematici e un layer editoriale che convive con il blog.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <div
          v-for="item in stackItems"
          :key="item.label"
          class="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3"
        >
          <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <component :is="item.icon" class="size-4" />
            </div>
            <div>
              <p class="text-sm font-medium">{{ item.label }}</p>
              <p class="text-xs text-muted-foreground">{{ item.value }}</p>
            </div>
          </div>
          <span class="h-2.5 w-2.5 rounded-full bg-primary" />
        </div>
      </CardContent>

      <CardFooter class="flex flex-wrap gap-3">
        <Button as="a" :href="withBase(firstPost?.link || '/travel/alaska/day-1')">
          Apri la prima tappa
        </Button>
        <Button
          as="a"
          :href="withBase(latestPost?.link || '/travel/alaska/')"
          variant="outline"
          class="gap-2"
        >
          Ultima tappa
          <MoveRight class="size-4" />
        </Button>
        <Button
          v-if="latestBlog"
          as="a"
          :href="withBase(latestBlog.link)"
          variant="ghost"
          class="rounded-full"
        >
          Apri ultimo articolo blog
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
