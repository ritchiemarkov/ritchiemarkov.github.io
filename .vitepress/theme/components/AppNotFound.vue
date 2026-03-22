<template>
  <div class="px-4 pb-24 pt-[calc(var(--vp-nav-height)+2rem)]">
    <Card class="mx-auto max-w-2xl rounded-[32px] border-border/70 bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
      <CardHeader class="text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          404
        </p>
        <CardTitle class="text-4xl">Pagina non trovata</CardTitle>
        <CardDescription>
          Il contenuto richiesto non esiste oppure e stato spostato.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex justify-center gap-3">
        <Button as="a" href="/">Home</Button>
        <Button as="a" href="/progetti/" variant="outline">Apri i progetti</Button>
      </CardContent>
    </Card>
  </div>
</template>
