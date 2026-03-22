<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { ExternalLink } from 'lucide-vue-next'

import { getGalleryEntry } from '../data/galleries'

import GalleryMosaic from './GalleryMosaic.vue'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const props = defineProps({
  trip: {
    type: String,
    required: true
  },
  gallery: {
    type: String,
    required: true
  }
})

const { frontmatter } = useData()

const entry = computed(() => getGalleryEntry(props.trip, props.gallery))
const description = computed(() =>
  frontmatter.value.description ||
  (entry.value
    ? `Galleria fotografica collegata a ${entry.value.sourceTitle}.`
    : '')
)
</script>

<template>
  <section v-if="entry" class="space-y-8">
    <div class="rounded-[1.75rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div class="flex flex-wrap items-center gap-2">
        <Badge variant="outline" class="rounded-full uppercase tracking-[0.16em]">
          Galleria
        </Badge>
        <Badge v-if="entry.tripLabel" variant="secondary" class="rounded-full">
          {{ entry.tripLabel }}
        </Badge>
        <Badge v-if="entry.dayNumber" variant="outline" class="rounded-full">
          Day {{ entry.dayNumber }}
        </Badge>
      </div>

      <h2 class="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        {{ entry.title }}
      </h2>
      <p class="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
        {{ description }}
      </p>

      <div class="mt-5 flex flex-wrap gap-2">
        <Button as-child variant="outline" class="rounded-full">
          <a :href="entry.sourceLink">Apri il diario</a>
        </Button>
        <Button
          v-if="entry.wordpress?.link"
          as-child
          class="rounded-full"
        >
          <a :href="entry.wordpress.link" target="_blank" rel="noreferrer">
            Apri la galleria WordPress
            <ExternalLink class="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>

    <GalleryMosaic
      :gallery="entry"
      :preview-limit="entry.items.length"
      :show-header="false"
      :show-open-link="false"
    />
  </section>

  <p v-else class="text-sm text-muted-foreground">
    Galleria non trovata.
  </p>
</template>
