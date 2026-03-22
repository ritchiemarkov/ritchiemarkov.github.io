<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { ArrowRight, BookOpenText, Images } from 'lucide-vue-next'

import { getGalleryCollection } from '../data/galleries'

import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'

const props = defineProps({
  trip: {
    type: String,
    required: true
  }
})

const { frontmatter } = useData()

const collection = computed(() => getGalleryCollection(props.trip))
const description = computed(() =>
  frontmatter.value.description ||
  (collection.value
    ? `Selezione fotografica del viaggio ${collection.value.label}.`
    : '')
)
</script>

<template>
  <section v-if="collection" class="space-y-8">
    <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem_15rem]">
      <div class="rounded-[1.75rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
        <div class="flex flex-wrap items-center gap-2">
          <Badge variant="outline" class="rounded-full uppercase tracking-[0.16em]">
            Raccolta
          </Badge>
          <Badge variant="secondary" class="rounded-full">
            {{ collection.label }}
          </Badge>
        </div>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          {{ collection.label }}
        </h2>
        <p class="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          {{ description }}
        </p>
      </div>

      <div class="rounded-[1.75rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
        <p class="text-xs uppercase tracking-[0.16em] text-muted-foreground">Gallerie</p>
        <p class="mt-3 text-4xl font-semibold text-foreground">{{ collection.count }}</p>
      </div>

      <div class="rounded-[1.75rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
        <p class="text-xs uppercase tracking-[0.16em] text-muted-foreground">Immagini</p>
        <p class="mt-3 text-4xl font-semibold text-foreground">{{ collection.imageCount }}</p>
      </div>
    </div>

    <div class="grid gap-5 xl:grid-cols-2">
      <Card
        v-for="gallery in collection.galleries"
        :key="gallery.slug"
        class="overflow-hidden rounded-[1.75rem] border-border/70 bg-card/95 shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
      >
        <div v-if="gallery.coverImage" class="aspect-[16/10] overflow-hidden border-b border-border/70">
          <img
            :src="gallery.coverImage.src"
            :alt="gallery.coverImage.alt || gallery.title"
            loading="lazy"
            class="h-full w-full object-cover"
          />
        </div>

        <CardHeader class="space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <Badge v-if="gallery.dayNumber" variant="outline" class="rounded-full">
              Day {{ gallery.dayNumber }}
            </Badge>
            <Badge variant="secondary" class="rounded-full">
              {{ gallery.itemCount }} immagini
            </Badge>
          </div>

          <CardTitle class="text-2xl">{{ gallery.title }}</CardTitle>
          <CardDescription>
            {{ gallery.sourceTitle }}
          </CardDescription>
        </CardHeader>

        <CardContent class="grid gap-3 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <Images class="h-4 w-4" />
            <span>Sequenza estratta dal post originale</span>
          </div>
          <div class="flex items-center gap-2">
            <BookOpenText class="h-4 w-4" />
            <span>{{ gallery.sourceLink }}</span>
          </div>
        </CardContent>

        <CardFooter class="flex flex-wrap gap-2">
          <Button as-child variant="outline" class="rounded-full">
            <a :href="gallery.sourceLink">Apri il diario</a>
          </Button>
          <Button as-child class="rounded-full">
            <a :href="gallery.link">
              Apri la galleria
              <ArrowRight class="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  </section>

  <p v-else class="text-sm text-muted-foreground">
    Nessuna raccolta disponibile per questo viaggio.
  </p>
</template>
