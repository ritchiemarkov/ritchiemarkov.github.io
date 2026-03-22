<script setup>
defineProps({
  id: { type: String, required: true },
  title: { type: String, default: 'Video YouTube' },
  ratio: { type: String, default: '16:9' }
})
</script>

<template>
  <div
    class="youtube-embed"
    data-service="youtube"
    :data-id="id"
    :data-title="title"
    :data-ratio="ratio"
    data-autoscale
    data-iframe-loading="lazy"
  />
</template>

<style scoped>
.youtube-embed {
  margin: 1.5rem 0;
  border-radius: var(--radius);
  overflow: hidden;
}
</style>
