<script setup>
import { computed } from 'vue'
import { Hotel, Train, Info } from 'lucide-vue-next'

const props = defineProps({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  alertType: { type: String, default: 'hotel' }
})

const config = computed(() => {
  switch (props.alertType) {
    case 'hotel':
      return {
        icon: Hotel,
        border: 'border-amber-400/50 dark:border-amber-500/40',
        bg: 'bg-amber-50/60 dark:bg-amber-950/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        titleColor: 'text-amber-900 dark:text-amber-200'
      }
    case 'train':
      return {
        icon: Train,
        border: 'border-sky-400/50 dark:border-sky-500/40',
        bg: 'bg-sky-50/60 dark:bg-sky-950/30',
        iconColor: 'text-sky-600 dark:text-sky-400',
        titleColor: 'text-sky-900 dark:text-sky-200'
      }
    default:
      return {
        icon: Info,
        border: 'border-border',
        bg: 'bg-muted/40',
        iconColor: 'text-muted-foreground',
        titleColor: 'text-foreground'
      }
  }
})
</script>

<template>
  <div
    class="info-box my-6 flex items-start gap-3.5 rounded-xl border px-5 py-4"
    :class="[config.border, config.bg]"
  >
    <component
      :is="config.icon"
      :size="20"
      class="mt-0.5 shrink-0"
      :class="config.iconColor"
      :stroke-width="1.75"
    />
    <div class="min-w-0">
      <p
        v-if="title"
        class="m-0 text-[0.82rem] font-semibold uppercase tracking-wide"
        :class="config.titleColor"
      >
        {{ title }}
      </p>
      <p class="m-0 text-[0.95rem] text-foreground/90">
        {{ content }}
      </p>
    </div>
  </div>
</template>
