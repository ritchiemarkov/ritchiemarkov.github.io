<script setup>
import { inject } from 'vue'
import { MoonStar, SunMedium } from 'lucide-vue-next'
import { useData } from 'vitepress'

import { Button } from './ui/button'

const { isDark } = useData()

const toggleAppearance = inject('toggle-appearance', () => {
  isDark.value = !isDark.value
})
</script>

<template>
  <Button
    variant="outline"
    size="icon"
    class="rounded-full"
    :aria-label="isDark ? 'Attiva tema chiaro' : 'Attiva tema scuro'"
    @click="toggleAppearance"
  >
    <SunMedium v-if="isDark" class="size-4" />
    <MoonStar v-else class="size-4" />
  </Button>
</template>

