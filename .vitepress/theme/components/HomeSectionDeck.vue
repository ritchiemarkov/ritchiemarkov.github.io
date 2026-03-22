<script setup>
import { Camera, Map, NotebookPen, Plane, UserRound, Waypoints } from 'lucide-vue-next'
import { withBase } from 'vitepress'

import { getLatestPosts } from '../data/content'

const latestTravel = getLatestPosts('travel', 3)
const latestBlog = getLatestPosts('blog', 3)

const sections = [
  {
    title: 'Viaggi',
    description: 'Landing dei viaggi, diario per giorno e tassonomia automatica.',
    link: '/travel/',
    icon: Plane
  },
  {
    title: 'Gallerie',
    description: 'Raccolte visuali associate ai viaggi, organizzate per destinazione.',
    link: '/galleries/',
    icon: Camera
  },
  {
    title: 'Mappe',
    description: 'Una mappa principale per viaggio, utile per orientamento e tappe.',
    link: '/maps/',
    icon: Map
  },
  {
    title: 'Blog',
    description: 'Articoli editoriali separati dai viaggi, ma con la stessa logica archive.',
    link: '/blog/',
    icon: NotebookPen
  },
  {
    title: 'About',
    description: 'Chi scrive, approccio editoriale e criteri con cui viene costruito il sito.',
    link: '/about/',
    icon: UserRound
  },
  {
    title: 'Contacts',
    description: 'Pagina contatti, collaborazioni, press e richieste relative ai contenuti.',
    link: '/contacts/',
    icon: Waypoints
  }
]
</script>

<template>
  <section class="mx-auto mt-8 max-w-[1380px] px-4 pb-8">
    <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card class="rounded-[30px] border-border/70 bg-card/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <CardHeader>
          <Badge variant="secondary">Magazine flow</Badge>
          <CardTitle class="mt-3 text-3xl">Ultimi contenuti pubblicati</CardTitle>
          <CardDescription>
            Travel e blog convivono nello stesso flusso editoriale, ma con landing e archive separati.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-5 lg:grid-cols-2">
          <div class="grid gap-3">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Travel</p>
            <a
              v-for="post in latestTravel"
              :key="post.link"
              :href="withBase(post.link)"
              class="rounded-[1.35rem] border border-border/70 bg-background/80 px-4 py-4 transition-colors hover:bg-secondary/80"
            >
              <div class="flex flex-wrap gap-2">
                <Badge v-if="post.tripSlug" variant="secondary">{{ post.tripSlug }}</Badge>
                <Badge v-if="post.day" variant="outline">{{ post.day }}</Badge>
              </div>
              <p class="mt-3 text-base font-semibold text-foreground">{{ post.title }}</p>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ post.excerpt }}</p>
            </a>
          </div>

          <div class="grid gap-3">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Blog</p>
            <a
              v-for="post in latestBlog"
              :key="post.link"
              :href="withBase(post.link)"
              class="rounded-[1.35rem] border border-border/70 bg-background/80 px-4 py-4 transition-colors hover:bg-secondary/80"
            >
              <div class="flex flex-wrap gap-2">
                <Badge variant="secondary">Blog</Badge>
                <Badge v-if="post.publishedDate" variant="outline">{{ post.publishedDate }}</Badge>
              </div>
              <p class="mt-3 text-base font-semibold text-foreground">{{ post.title }}</p>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ post.excerpt }}</p>
            </a>
          </div>
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
        <Card
          v-for="section in sections"
          :key="section.title"
          class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_18px_52px_rgba(15,23,42,0.08)]"
        >
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="grid size-11 place-items-center rounded-2xl bg-secondary/95">
                <component :is="section.icon" class="size-4" />
              </div>
              <CardTitle class="text-xl">{{ section.title }}</CardTitle>
            </div>
            <CardDescription>{{ section.description }}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button as="a" :href="withBase(section.link)" variant="outline" class="rounded-full">
              Apri sezione
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </section>
</template>
