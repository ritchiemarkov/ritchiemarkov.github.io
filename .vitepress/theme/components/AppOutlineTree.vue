<script setup>
import { useData } from 'vitepress'

const props = defineProps({
  headers: {
    type: Array,
    default: () => []
  },
  nested: {
    type: Boolean,
    default: false
  }
})

const { hash } = useData()

function isActive(link) {
  return hash.value === link
}
</script>

<template>
  <ul
    :class="[
      'm-0 grid list-none gap-1 p-0',
      nested && 'ml-4 border-l border-border/70 pl-2.5'
    ]"
  >
    <li v-for="header in props.headers" :key="header.link">
      <a
        :class="[
          'flex min-h-[2.35rem] items-center rounded-[0.95rem] px-3.5 text-[0.9rem] leading-[1.35] text-foreground/80 transition-[background-color,color] duration-200 hover:bg-secondary/92 hover:text-foreground',
          isActive(header.link) && 'bg-secondary/92 font-semibold text-foreground'
        ]"
        :href="header.link"
      >
        {{ header.title }}
      </a>
      <AppOutlineTree
        v-if="header.children?.length"
        :headers="header.children"
        nested
      />
    </li>
  </ul>
</template>
