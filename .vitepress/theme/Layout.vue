<script setup>
import { computed, onMounted, provide, useSlots } from 'vue'
import { useData } from 'vitepress'

import { layoutInfoInjectionKey, registerWatchers, useLayout } from './composables/layout'
import { useSidebarControl } from './composables/sidebar'
import { initCookieConsent } from './cookieconsent-config'

import AppBackdrop from './components/AppBackdrop.vue'
import AppContent from './components/AppContent.vue'
import AppFooter from './components/AppFooter.vue'
import AppLocalNav from './components/AppLocalNav.vue'
import AppNav from './components/AppNav.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppSkipLink from './components/AppSkipLink.vue'
import HeroPanel from './components/HeroPanel.vue'
import HomeMetrics from './components/HomeMetrics.vue'
import { Badge } from './components/ui/badge'

const {
  isOpen: isSidebarOpen,
  open: openSidebar,
  close: closeSidebar
} = useSidebarControl()

registerWatchers({ closeSidebar })

const { frontmatter, theme } = useData()
useLayout()
const slots = useSlots()
const heroImageSlotExists = computed(() => !!slots['home-hero-image'])

provide(layoutInfoInjectionKey, { heroImageSlotExists })

onMounted(() => {
  initCookieConsent()
})
</script>

<template>
  <div
    v-if="frontmatter.layout !== false"
    class="Layout"
    :class="frontmatter.pageClass"
  >
    <slot name="layout-top" />
    <AppNav />
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="site-orb site-orb-left" />
      <div class="site-orb site-orb-right" />
      <div class="site-grid" />
    </div>
    <AppSkipLink />
    <AppBackdrop class="backdrop" :show="isSidebarOpen" @click="closeSidebar" />

    <AppLocalNav :open="isSidebarOpen" @open-menu="openSidebar" />

    <AppSidebar :open="isSidebarOpen">
      <template #sidebar-nav-after><slot name="sidebar-nav-after" /></template>
    </AppSidebar>

    <AppContent>
      <template #page-top><slot name="page-top" /></template>
      <template #page-bottom><slot name="page-bottom" /></template>
      <template #not-found><slot name="not-found" /></template>
      <template #home-hero-before><slot name="home-hero-before" /></template>
      <template #home-hero-info-before>
        <Badge class="mb-4" variant="secondary">
          {{ theme.homeBadge || 'Travel journal' }}
        </Badge>
        <slot name="home-hero-info-before" />
      </template>
      <template #home-hero-info><slot name="home-hero-info" /></template>
      <template #home-hero-info-after><slot name="home-hero-info-after" /></template>
      <template #home-hero-actions-after><slot name="home-hero-actions-after" /></template>
      <template #home-hero-image>
        <HeroPanel />
        <slot name="home-hero-image" />
      </template>
      <template #home-hero-after><slot name="home-hero-after" /></template>
      <template #home-features-before><slot name="home-features-before" /></template>
      <template #home-features-after>
        <HomeMetrics />
        <slot name="home-features-after" />
      </template>
      <template #doc-footer-before><slot name="doc-footer-before" /></template>
      <template #doc-before><slot name="doc-before" /></template>
      <template #doc-after><slot name="doc-after" /></template>
      <template #doc-top><slot name="doc-top" /></template>
      <template #doc-bottom><slot name="doc-bottom" /></template>
      <template #aside-top><slot name="aside-top" /></template>
      <template #aside-bottom><slot name="aside-bottom" /></template>
      <template #aside-outline-before><slot name="aside-outline-before" /></template>
      <template #aside-outline-after><slot name="aside-outline-after" /></template>
      <template #aside-ads-before><slot name="aside-ads-before" /></template>
      <template #aside-ads-after><slot name="aside-ads-after" /></template>
    </AppContent>

    <AppFooter />
    <slot name="layout-bottom" />
  </div>
  <Content v-else />
</template>
