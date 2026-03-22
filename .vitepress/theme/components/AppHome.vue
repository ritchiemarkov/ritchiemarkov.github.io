<script setup>
import { useData, withBase } from 'vitepress'

const { frontmatter: fm } = useData()

function resolveActionTheme(theme) {
  if (theme === 'alt') return 'outline'
  return 'default'
}
</script>

<template>
  <div class="w-full flex-1 px-0 pb-28 pt-[calc(var(--vp-nav-height)+2rem)] max-[960px]:pt-[calc(var(--vp-nav-height)+1.5rem)]">
    <slot name="home-hero-before" />

    <section v-if="fm.hero" class="px-4 pt-4">
      <div class="mx-auto grid max-w-[1380px] gap-8 rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_92%,transparent),color-mix(in_oklab,var(--background)_92%,transparent))] p-6 shadow-[0_28px_80px_rgba(15,23,42,0.1)] backdrop-blur-[18px] min-[960px]:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] min-[960px]:items-center min-[960px]:p-8">
        <div class="flex flex-col justify-center">
          <slot name="home-hero-info-before" />
          <p class="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            {{ fm.hero.kicker || 'Travel journal' }}
          </p>
          <h1
            class="m-0 flex flex-col gap-1 text-[clamp(2.9rem,7vw,5.9rem)] leading-[0.95] tracking-[-0.045em]"
            style="font-family: var(--font-display)"
          >
            <span v-if="fm.hero.name">{{ fm.hero.name }}</span>
            <span
              v-if="fm.hero.text"
              class="bg-[linear-gradient(135deg,#b45309_0%,#f59e0b_40%,#fb923c_100%)] bg-clip-text text-transparent"
            >
              {{ fm.hero.text }}
            </span>
          </h1>
          <p v-if="fm.hero.tagline" class="mt-5 max-w-[42rem] text-[1.05rem] leading-[1.8] text-muted-foreground">
            {{ fm.hero.tagline }}
          </p>
          <slot name="home-hero-info" />
          <slot name="home-hero-info-after" />

          <div v-if="fm.hero.actions?.length" class="mt-6 flex flex-wrap gap-3.5">
            <Button
              v-for="action in fm.hero.actions"
              :key="action.text"
              as="a"
              :href="withBase(action.link)"
              :variant="resolveActionTheme(action.theme)"
              size="lg"
              class="rounded-full"
            >
              {{ action.text }}
            </Button>
          </div>
          <slot name="home-hero-actions-after" />
        </div>

        <div class="flex items-stretch">
          <slot name="home-hero-image" />
        </div>
      </div>
    </section>

    <slot name="home-hero-after" />

    <section v-if="fm.features?.length" class="mt-8 px-4">
      <slot name="home-features-before" />
      <div class="mx-auto grid max-w-[1380px] gap-4 min-[960px]:grid-cols-3">
        <Card
          v-for="feature in fm.features"
          :key="feature.title"
          class="rounded-[30px] border-border/70 bg-card/90 shadow-[0_18px_52px_rgba(15,23,42,0.08)]"
        >
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="grid size-12 place-items-center rounded-2xl bg-secondary/95 text-[1.05rem] font-semibold">
                {{ feature.icon }}
              </div>
              <CardTitle class="text-xl">{{ feature.title }}</CardTitle>
            </div>
            <CardDescription>{{ feature.details }}</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <slot name="home-features-after" />
    </section>

    <div v-if="fm.markdownStyles !== false" class="mt-8 px-4">
      <div class="vp-doc mx-auto max-w-[1180px] rounded-[2rem] border border-border/80 bg-card/88 p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
        <Content />
      </div>
    </div>
    <Content v-else />
  </div>
</template>
