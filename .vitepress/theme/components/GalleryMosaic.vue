<script setup>
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, ExternalLink, Images } from 'lucide-vue-next'

import { AspectRatio } from './ui/aspect-ratio'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { ScrollArea, ScrollBar } from './ui/scroll-area'

const props = defineProps({
  gallery: {
    type: Object,
    required: true
  },
  previewLimit: {
    type: Number,
    default: 6
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showOpenLink: {
    type: Boolean,
    default: true
  }
})

const open = ref(false)
const activeIndex = ref(0)

const items = computed(() => props.gallery?.items || [])
const previewItems = computed(() => items.value.slice(0, Math.max(props.previewLimit, 1)))
const activeItem = computed(() => items.value[activeIndex.value] || null)
const remainingCount = computed(() => Math.max(items.value.length - previewItems.value.length, 0))

watch(items, (nextItems) => {
  if (!nextItems.length) {
    activeIndex.value = 0
    open.value = false
    return
  }

  if (activeIndex.value > nextItems.length - 1) {
    activeIndex.value = 0
  }
}, { immediate: true })

function openAt(index) {
  activeIndex.value = index
  open.value = true
}

function showPrev() {
  if (!items.value.length) return
  activeIndex.value = activeIndex.value === 0 ? items.value.length - 1 : activeIndex.value - 1
}

function showNext() {
  if (!items.value.length) return
  activeIndex.value = activeIndex.value === items.value.length - 1 ? 0 : activeIndex.value + 1
}
</script>

<template>
  <section
    v-if="items.length"
    class="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/95 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
  >
    <div
      v-if="showHeader"
      class="flex flex-col gap-4 border-b border-border/70 px-5 py-5 sm:px-6"
    >
      <div class="flex flex-wrap items-center gap-2">
        <Badge variant="outline" class="rounded-full uppercase tracking-[0.16em]">
          Galleria
        </Badge>
        <Badge
          v-if="gallery.tripLabel"
          variant="secondary"
          class="rounded-full"
        >
          {{ gallery.tripLabel }}
        </Badge>
        <span class="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {{ items.length }} immagini
        </span>
      </div>

      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-2">
          <h2 class="text-2xl font-semibold tracking-tight text-foreground">
            {{ gallery.title }}
          </h2>
          <p class="max-w-3xl text-sm leading-6 text-muted-foreground">
            {{ gallery.sourceExcerpt || `Sequenza fotografica collegata a ${gallery.sourceTitle}.` }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <Button
            v-if="showOpenLink && gallery.link"
            as-child
            variant="outline"
            class="rounded-full"
          >
            <a :href="gallery.link">
              Apri pagina galleria
              <ExternalLink class="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            v-if="gallery.sourceLink"
            as-child
            class="rounded-full"
          >
            <a :href="gallery.sourceLink">Torna al diario</a>
          </Button>
        </div>
      </div>
    </div>

    <div class="space-y-4 px-5 py-5 sm:px-6">
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <button
          v-for="(item, index) in previewItems"
          :key="`${item.src}-${index}`"
          type="button"
          class="group overflow-hidden rounded-[1.25rem] border border-border/60 bg-muted/20 text-left transition hover:-translate-y-0.5 hover:border-border hover:shadow-[0_20px_40px_rgba(15,23,42,0.10)]"
          @click="openAt(index)"
        >
          <AspectRatio :ratio="index === 0 ? 4 / 3 : 1">
            <img
              :src="item.src"
              :alt="item.alt || item.caption || gallery.title"
              loading="lazy"
              class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          </AspectRatio>
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <p class="line-clamp-1 text-sm font-medium text-foreground">
              {{ item.caption || item.alt || gallery.title }}
            </p>
            <Images class="h-4 w-4 text-muted-foreground" />
          </div>
        </button>
      </div>

      <p v-if="remainingCount > 0" class="text-sm text-muted-foreground">
        +{{ remainingCount }} immagini aggiuntive nella galleria completa.
      </p>
    </div>

    <Dialog v-model:open="open">
      <DialogContent class="max-w-6xl border-border/80 bg-background/98 p-0">
        <template v-if="activeItem">
          <DialogHeader class="border-b border-border/70 px-6 py-5">
            <DialogTitle class="text-xl font-semibold text-foreground">
              {{ gallery.title }}
            </DialogTitle>
            <DialogDescription class="text-sm text-muted-foreground">
              {{ activeItem.caption || activeItem.alt || gallery.sourceTitle }}
            </DialogDescription>
          </DialogHeader>

          <div class="grid gap-0 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div class="relative bg-muted/20 p-4 sm:p-6">
              <img
                :src="activeItem.src"
                :alt="activeItem.alt || activeItem.caption || gallery.title"
                class="max-h-[72vh] w-full rounded-[1.25rem] object-contain"
              />

              <div class="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-6">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  class="pointer-events-auto rounded-full"
                  @click="showPrev"
                >
                  <ChevronLeft class="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  class="pointer-events-auto rounded-full"
                  @click="showNext"
                >
                  <ChevronRight class="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div class="border-t border-border/70 lg:border-l lg:border-t-0">
              <ScrollArea class="h-full max-h-[72vh] px-4 py-4">
                <div class="grid gap-3">
                  <button
                    v-for="(item, index) in items"
                    :key="`${item.src}-${index}`"
                    type="button"
                    class="overflow-hidden rounded-[1rem] border text-left transition"
                    :class="index === activeIndex ? 'border-foreground shadow-sm' : 'border-border/60 hover:border-border'"
                    @click="activeIndex = index"
                  >
                    <AspectRatio :ratio="1">
                      <img
                        :src="item.src"
                        :alt="item.alt || item.caption || gallery.title"
                        loading="lazy"
                        class="h-full w-full object-cover"
                      />
                    </AspectRatio>
                    <div class="px-3 py-2">
                      <p class="line-clamp-2 text-xs leading-5 text-foreground">
                        {{ item.caption || item.alt || gallery.title }}
                      </p>
                    </div>
                  </button>
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </div>
        </template>
      </DialogContent>
    </Dialog>
  </section>
</template>
