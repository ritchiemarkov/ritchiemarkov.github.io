<script setup>
import { computed } from 'vue'

import { getTravelTrip } from '../data/content'
import { Badge } from './ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

const props = defineProps({
  trip: {
    type: String,
    required: true
  }
})

const trip = computed(() => getTravelTrip(props.trip))
</script>

<template>
  <div v-if="trip" class="grid gap-6">
    <div class="grid gap-4 md:grid-cols-3">
      <Card class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
        <CardHeader>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tappe</p>
          <CardTitle>{{ trip.count }}</CardTitle>
          <CardDescription>Giorni pubblicati per questo viaggio.</CardDescription>
        </CardHeader>
      </Card>

      <Card class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
        <CardHeader>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Inizio</p>
          <CardTitle class="text-xl">{{ trip.firstPost?.day || trip.firstPost?.title }}</CardTitle>
          <CardDescription>{{ trip.firstPost?.excerpt }}</CardDescription>
        </CardHeader>
      </Card>

      <Card class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
        <CardHeader>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Ultima tappa</p>
          <CardTitle class="text-xl">{{ trip.lastPost?.day || trip.lastPost?.title }}</CardTitle>
          <CardDescription>{{ trip.lastPost?.excerpt }}</CardDescription>
        </CardHeader>
      </Card>
    </div>

    <div class="grid gap-4">
      <Card
        v-for="post in trip.posts"
        :key="post.link"
        class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_18px_52px_rgba(15,23,42,0.08)]"
      >
        <CardHeader class="gap-3">
          <div class="flex flex-wrap gap-2">
            <Badge variant="secondary">{{ trip.label }}</Badge>
            <Badge v-if="post.day" variant="outline">{{ post.day }}</Badge>
            <Badge v-if="post.publishedDate" variant="outline">{{ post.publishedDate }}</Badge>
          </div>
          <CardTitle class="text-2xl">
            <a :href="post.link" class="hover:text-primary">
              {{ post.title }}
            </a>
          </CardTitle>
          <CardDescription>{{ post.excerpt || 'Nessun estratto disponibile.' }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-for="tag in post.tags.slice(0, 6)"
              :key="`${post.link}-${tag.slug}`"
              variant="outline"
            >
              {{ tag.label }}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
