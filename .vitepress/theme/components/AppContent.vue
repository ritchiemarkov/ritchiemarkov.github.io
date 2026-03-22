<script setup>
import { useData } from 'vitepress'

import { useLayout } from '../composables/layout'

import AppDoc from './AppDoc.vue'
import AppHome from './AppHome.vue'
import AppNotFound from './AppNotFound.vue'
import AppPage from './AppPage.vue'

const { page, frontmatter } = useData()
const { isHome, hasSidebar } = useLayout()
</script>

<template>
  <div
    class="app-content"
    id="VPContent"
    :class="{ 'has-sidebar': hasSidebar, 'is-home': isHome }"
  >
    <slot name="not-found" v-if="page.isNotFound"><AppNotFound /></slot>

    <AppPage v-else-if="frontmatter.layout === 'page'">
      <template #page-top><slot name="page-top" /></template>
      <template #page-bottom><slot name="page-bottom" /></template>
    </AppPage>

    <AppHome v-else-if="frontmatter.layout === 'home'">
      <template #home-hero-before><slot name="home-hero-before" /></template>
      <template #home-hero-info-before><slot name="home-hero-info-before" /></template>
      <template #home-hero-info><slot name="home-hero-info" /></template>
      <template #home-hero-info-after><slot name="home-hero-info-after" /></template>
      <template #home-hero-actions-after><slot name="home-hero-actions-after" /></template>
      <template #home-hero-image><slot name="home-hero-image" /></template>
      <template #home-hero-after><slot name="home-hero-after" /></template>
      <template #home-features-before><slot name="home-features-before" /></template>
      <template #home-features-after><slot name="home-features-after" /></template>
    </AppHome>

    <component
      v-else-if="frontmatter.layout && frontmatter.layout !== 'doc'"
      :is="frontmatter.layout"
    />

    <AppDoc v-else>
      <template #doc-top><slot name="doc-top" /></template>
      <template #doc-bottom><slot name="doc-bottom" /></template>
      <template #doc-footer-before><slot name="doc-footer-before" /></template>
      <template #doc-before><slot name="doc-before" /></template>
      <template #doc-after><slot name="doc-after" /></template>
      <template #aside-top><slot name="aside-top" /></template>
      <template #aside-outline-before><slot name="aside-outline-before" /></template>
      <template #aside-outline-after><slot name="aside-outline-after" /></template>
      <template #aside-ads-before><slot name="aside-ads-before" /></template>
      <template #aside-ads-after><slot name="aside-ads-after" /></template>
      <template #aside-bottom><slot name="aside-bottom" /></template>
    </AppDoc>
  </div>
</template>
