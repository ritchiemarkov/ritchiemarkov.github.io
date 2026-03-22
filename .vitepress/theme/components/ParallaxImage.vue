<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  imageURL: { type: String, required: true },
  imageSize: { type: String, default: 'full' },
  imageID: { type: [Number, String], default: null }
})

const container = ref(null)
const img = ref(null)
let cleanup = null

const sizeClass = computed(() =>
  props.imageSize === 'half' ? 'max-h-[50vh]' : 'max-h-[75vh]'
)

onMounted(async () => {
  if (!container.value || !img.value) return

  container.value.style.position = 'relative'

  const { scroll } = await import('motion')

  cleanup = scroll(
    (progress) => {
      if (img.value) {
        img.value.style.transform = `translateY(${progress * 25 - 12.5}%)`
      }
    },
    {
      target: container.value,
      offset: ['start end', 'end start']
    }
  )
})

onUnmounted(() => {
  if (cleanup) cleanup()
})
</script>

<template>
  <figure
    ref="container"
    class="parallax-container relative group my-8 overflow-hidden rounded-2xl"
    :class="sizeClass"
  >
    <img
      ref="img"
      :src="imageURL"
      :alt="`Immagine ${imageID || ''}`"
      loading="lazy"
      decoding="async"
      class="parallax-img"
    />
    <div class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/[0.06] dark:ring-white/[0.06]" />
  </figure>
</template>

<style scoped>
.parallax-container {
  position: relative;
  will-change: transform;
}

.parallax-img {
  display: block;
  width: 100%;
  height: 130%;
  object-fit: cover;
  will-change: transform;
}
</style>
