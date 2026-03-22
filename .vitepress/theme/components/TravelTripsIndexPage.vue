<script setup>
import { getTravelTrips } from '../data/content'
import { Badge } from './ui/badge'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

const trips = getTravelTrips()
</script>

<template>
  <div class="grid gap-6">
    <div class="rounded-[1.75rem] border border-border/70 bg-card/82 p-5">
      <p class="text-sm leading-7 text-muted-foreground">
        Qui trovi tutti i viaggi caricati, ognuno con una pagina indice che raccoglie i giorni pubblicati.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="trip in trips"
        :key="trip.slug"
        class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_18px_52px_rgba(15,23,42,0.08)]"
      >
        <CardHeader class="gap-3">
          <div class="flex flex-wrap gap-2">
            <Badge variant="secondary">{{ trip.label }}</Badge>
            <Badge variant="outline">{{ trip.count }} giorni</Badge>
          </div>
          <CardTitle class="text-2xl">
            <a :href="`/travel/${trip.slug}/`" class="hover:text-primary">
              {{ trip.label }}
            </a>
          </CardTitle>
          <CardDescription>
            {{ trip.firstPost?.excerpt || 'Indice del viaggio.' }}
          </CardDescription>
        </CardHeader>
        <CardFooter class="flex items-center justify-between gap-3">
          <span class="text-sm text-muted-foreground">
            {{ trip.firstPost?.day || 'Prima tappa' }} -> {{ trip.lastPost?.day || 'Ultima tappa' }}
          </span>
          <Button as="a" :href="`/travel/${trip.slug}/`" variant="outline" class="rounded-full">
            Apri index
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
