<script setup>
import { Menu, MountainSnow } from 'lucide-vue-next'
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

import AppSearch from './AppSearch.vue'
import AppThemeToggle from './AppThemeToggle.vue'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from './ui/navigation-menu'
import { Separator } from './ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet'
import { cn } from '../lib'

const { page, site, theme } = useData()

const navItems = computed(() =>
  (theme.value.nav || []).filter((item) => 'link' in item && typeof item.link === 'string')
)
const navBadge = computed(() => theme.value.navBadge)
const brandSubtitle = computed(() => theme.value.navline || 'viaggi, gallerie, mappe, blog')
const primaryAction = computed(() => theme.value.navCta || {
  text: 'Esplora Alaska',
  link: '/travel/alaska/'
})
const secondaryAction = computed(() => theme.value.navSecondaryCta || {
  text: 'Cerca nei viaggi',
  link: '/travel/search/'
})

function isExternal(link) {
  return /^(?:[a-z]+:)?\/\//i.test(link)
}

function resolveHref(link) {
  return isExternal(link) ? link : withBase(link)
}

function normalizeDocPath(input) {
  if (!input || input === '/') return ''

  return input
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/index\.md$/, '')
    .replace(/\.md$/, '')
}

function isActive(item) {
  if (item.activeMatch) {
    return new RegExp(item.activeMatch).test(page.value.relativePath)
  }

  if (isExternal(item.link)) return false

  const currentPath = normalizeDocPath(page.value.relativePath)
  const itemPath = normalizeDocPath(item.link)

  if (!itemPath) return currentPath === ''

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
}
</script>

<template>
  <header class="fixed left-0 top-[var(--vp-layout-top-height,0px)] z-[var(--vp-z-index-nav)] w-full px-[0.9rem] pt-[0.85rem] max-[960px]:px-[0.7rem]">
    <div class="mx-auto flex max-w-[1380px] min-h-[calc(var(--vp-nav-height)-0.4rem)] items-center gap-3 rounded-full border border-border/70 bg-card/85 px-[0.9rem] py-[0.7rem] shadow-[0_16px_60px_rgba(15,23,42,0.12)] backdrop-blur-[22px]">
      <a class="flex min-w-0 items-center gap-3 text-foreground" :href="withBase('/')">
        <div class="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_88%,white),color-mix(in_oklab,var(--primary)_64%,#7c2d12))] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
          <MountainSnow class="size-4" />
        </div>
        <div class="flex min-w-0 flex-col">
          <span class="text-[0.92rem] font-bold leading-[1.1] tracking-[-0.02em]">
            {{ theme.siteTitle ?? site.title }}
          </span>
          <span class="text-[0.72rem] text-muted-foreground">{{ brandSubtitle }}</span>
        </div>
        <Badge v-if="navBadge" class="hidden min-[960px]:inline-flex" variant="secondary">
          {{ navBadge }}
        </Badge>
      </a>

      <div class="hidden min-w-0 flex-1 justify-center min-[960px]:flex">
        <NavigationMenu class="w-full max-w-max">
          <NavigationMenuList class="flex items-center gap-1 rounded-full border border-border/70 bg-background/90 p-1">
            <NavigationMenuItem v-for="item in navItems" :key="`${item.text}-${item.link}`">
              <NavigationMenuLink as-child>
                <a
                  :href="resolveHref(item.link)"
                  :target="item.target"
                  :rel="item.rel"
                  :class="
                    cn(
                      'inline-flex min-h-[2.3rem] items-center justify-center rounded-full px-4 text-sm font-semibold text-foreground/80 transition-[background-color,color,box-shadow] duration-200 hover:bg-accent/90 hover:text-foreground',
                      isActive(item) && 'bg-secondary/95 text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--border)_85%,transparent)]'
                    )
                  "
                >
                  <span v-html="item.text" />
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <div class="hidden items-center min-[960px]:flex">
          <AppSearch />
        </div>

        <div class="hidden xl:flex">
          <AppThemeToggle />
        </div>

        <Button
          as="a"
          :href="resolveHref(primaryAction.link)"
          size="sm"
          class="hidden rounded-full px-4 min-[960px]:inline-flex"
        >
          {{ primaryAction.text }}
        </Button>

        <Sheet>
          <SheetTrigger as-child>
            <Button
              variant="outline"
              size="icon"
              class="size-10 rounded-full min-[960px]:hidden"
              aria-label="Apri navigazione"
            >
              <Menu class="size-4" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            class="border-border/70 bg-background/96 px-5 backdrop-blur-[18px] sm:max-w-md"
          >
            <SheetHeader class="space-y-3 text-left">
              <SheetTitle class="text-lg">Navigazione</SheetTitle>
              <SheetDescription>
                Navigazione principale, ricerca locale e accesso rapido alle sezioni del magazine.
              </SheetDescription>
            </SheetHeader>

            <div class="mt-6 space-y-5">
              <div>
                <AppSearch />
              </div>

              <Separator />

              <nav class="flex flex-col gap-2">
                <SheetClose
                  v-for="item in navItems"
                  :key="`mobile-${item.text}-${item.link}`"
                  as-child
                >
                  <a
                    :href="resolveHref(item.link)"
                    :target="item.target"
                    :rel="item.rel"
                    :class="
                      cn(
                        'flex min-h-12 items-center rounded-2xl border border-transparent bg-background/85 px-4 text-[0.95rem] font-semibold text-foreground transition-[border-color,background-color] duration-200 hover:border-border/80 hover:bg-secondary/90',
                        isActive(item) && 'border-border/80 bg-secondary/90'
                      )
                    "
                  >
                    <span v-html="item.text" />
                  </a>
                </SheetClose>
              </nav>

              <Separator />

              <div class="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/70 px-4 py-3">
                <div>
                  <p class="text-sm font-semibold">Tema</p>
                  <p class="text-xs text-muted-foreground">Light e dark mode</p>
                </div>
                <AppThemeToggle />
              </div>

              <div class="grid gap-3">
                <SheetClose as-child>
                  <Button
                    as="a"
                    :href="resolveHref(primaryAction.link)"
                    class="w-full justify-center rounded-full"
                  >
                    {{ primaryAction.text }}
                  </Button>
                </SheetClose>
                <SheetClose as-child>
                  <Button
                    as="a"
                    :href="resolveHref(secondaryAction.link)"
                    variant="outline"
                    class="w-full justify-center rounded-full"
                  >
                    {{ secondaryAction.text }}
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>
