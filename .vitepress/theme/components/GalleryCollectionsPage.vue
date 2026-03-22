<script setup>
import { computed } from 'vue'
import { Camera, FolderOpen } from 'lucide-vue-next'

import { getGalleryCollections } from '../data/galleries'

import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'

const collections = computed(() => getGalleryCollections())
</script>

<template>
  <section class="space-y-8">
    <div class="max-w-3xl space-y-3">
      <Badge variant="outline" class="rounded-full uppercase tracking-[0.16em]">
        Archivio visuale
      </Badge>
      <h2 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Tutte le gallerie collegate ai viaggi
      </h2>
      <p class="text-base leading-7 text-muted-foreground">
        Ogni raccolta nasce direttamente dai markdown e dagli shortcode galleria già presenti nei diari.
      </p>
    </div>

    <div v-if="collections.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="collection in collections"
        :key="collection.slug"
        class="overflow-hidden rounded-[1.75rem] border-border/70 bg-card/95 shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
      >
        <div v-if="collection.coverImage" class="aspect-[4/3] overflow-hidden border-b border-border/70">
          <img
            :src="collection.coverImage.src"
            :alt="collection.coverImage.alt || collection.label"
            loading="lazy"
            class="h-full w-full object-cover"
          />
        </div>

        <CardHeader class="space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" class="rounded-full">
              {{ collection.count }} gallerie
            </Badge>
            <Badge variant="outline" class="rounded-full">
              {{ collection.imageCount }} immagini
            </Badge>
          </div>
          <CardTitle class="text-2xl">{{ collection.label }}</CardTitle>
          <CardDescription>
            Una panoramica fotografica del viaggio, con ingressi per ogni giornata dotata di raccolta immagini.
          </CardDescription>
        </CardHeader>

        <CardContent class="grid gap-3 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <FolderOpen class="h-4 w-4" />
            <span>Hub gallerie del viaggio</span>
          </div>
          <div class="flex items-center gap-2">
            <Camera class="h-4 w-4" />
            <span>Collegato a diario e pagine travel</span>
          </div>
        </CardContent>

        <CardFooter>
          <Button as-child class="w-full rounded-full">
            <a :href="collection.link">Apri {{ collection.label }}</a>
          </Button>
        </CardFooter>
      </Card>
    </div>

    <p v-else class="text-sm text-muted-foreground">
      Nessuna galleria disponibile.
    </p>
  </section>
</template>
