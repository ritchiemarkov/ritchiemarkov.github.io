<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { showCookiePreferences } from '../cookieconsent-config'

const { theme, frontmatter } = useData()
const footerBadges = computed(() =>
  Array.isArray(theme.value.footer?.badges) ? theme.value.footer.badges : []
)
</script>

<template>
  <footer v-if="theme.footer && frontmatter.footer !== false" class="px-4 pb-4">
    <div class="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-border/80 bg-card/88 px-5 py-4">
      <div class="grid gap-0.5">
        <p v-if="theme.footer.message" class="m-0 text-[0.9rem] text-muted-foreground" v-html="theme.footer.message" />
        <p v-if="theme.footer.copyright" class="m-0 text-[0.9rem] text-muted-foreground" v-html="theme.footer.copyright" />
        <button
          type="button"
          class="m-0 cursor-pointer border-0 bg-transparent p-0 text-left text-[0.82rem] text-muted-foreground underline underline-offset-2 hover:text-foreground"
          data-cc="show-preferencesModal"
          @click="showCookiePreferences"
        >
          Preferenze cookie
        </button>
      </div>
      <div v-if="footerBadges.length" class="flex flex-wrap gap-2.5">
        <Badge
          v-for="(badge, index) in footerBadges"
          :key="`${badge}-${index}`"
          :variant="index === 0 ? 'secondary' : 'outline'"
        >
          {{ badge }}
        </Badge>
      </div>
    </div>
  </footer>
</template>
