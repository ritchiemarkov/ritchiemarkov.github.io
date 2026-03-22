<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import { getInlineGallery } from '../data/galleries'

import GalleryMosaic from './GalleryMosaic.vue'

const props = defineProps({
  galleryId: {
    type: String,
    required: true
  }
})

const { page } = useData()

const gallery = computed(() =>
  getInlineGallery(page.value.relativePath, props.galleryId)
)
</script>

<template>
  <GalleryMosaic
    v-if="gallery"
    :gallery="gallery"
    :preview-limit="6"
    class="my-10"
  />
</template>
