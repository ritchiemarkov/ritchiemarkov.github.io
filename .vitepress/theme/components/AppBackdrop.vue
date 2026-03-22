<script setup>
defineEmits(['click'])

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="app-backdrop" @click="$emit('click')" />
  </transition>
</template>
