<script setup>
import { ref } from 'vue'
import { BellRing, Layers3, SlidersHorizontal } from 'lucide-vue-next'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Kbd } from './ui/kbd'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import { Skeleton } from './ui/skeleton'
import { Switch } from './ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const updatesEnabled = ref(true)
const nightlyBuilds = ref(false)
const progress = ref(72)

const releaseSteps = [
  {
    title: 'Navbar custom',
    body: 'La navigazione principale vive nel tema locale e non dipende piu dalla barra default di VitePress.'
  },
  {
    title: 'Surface docs',
    body: 'Sidebar, local nav e outline vengono stilizzati come superfici del design system invece di restare neutrali.'
  },
  {
    title: 'UI registry',
    body: 'I componenti shadcn-vue installati restano pronti da usare sia in markdown sia in componenti Vue dedicati.'
  }
]
</script>

<template>
  <Tabs default-value="foundation" class="component-showcase">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Playground
        </p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight">Componenti shadcn-vue in uso reale</h2>
      </div>
      <TabsList class="rounded-full border border-border/70 bg-background/85 p-1">
        <TabsTrigger value="foundation" class="rounded-full px-4">Foundation</TabsTrigger>
        <TabsTrigger value="forms" class="rounded-full px-4">Forms</TabsTrigger>
        <TabsTrigger value="feedback" class="rounded-full px-4">Feedback</TabsTrigger>
      </TabsList>
    </div>

    <TabsContent value="foundation" class="mt-6">
      <div class="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="flex size-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <Layers3 class="size-5" />
              </div>
              <div>
                <CardTitle>Foundation kit</CardTitle>
                <CardDescription>Badge, avatar, separator e utility visive per docs e pagine statiche.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-5">
            <div class="flex flex-wrap items-center gap-3">
              <Badge>new</Badge>
              <Badge variant="secondary">stable</Badge>
              <Badge variant="outline">alpha docs</Badge>
              <Kbd>CMD</Kbd>
              <Kbd>K</Kbd>
            </div>
            <Separator />
            <div class="flex items-center gap-4 rounded-[24px] border border-border/70 bg-background/75 p-4">
              <Avatar size="base">
                <AvatarFallback>VP</AvatarFallback>
              </Avatar>
              <div class="space-y-1">
                <p class="text-sm font-semibold">Theme layer</p>
                <p class="text-sm text-muted-foreground">
                  Una base visuale coerente che puoi riusare per docs, changelog, dashboard statiche e landing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <CardHeader>
            <CardTitle>Snippet pronto</CardTitle>
            <CardDescription>Un blocco piccolo da inserire nelle pagine markdown senza creare un componente dedicato.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre class="overflow-x-auto rounded-[22px] border border-border/70 bg-secondary/35 p-4 text-sm leading-6 text-muted-foreground"><code>&lt;Alert&gt;
  &lt;AlertTitle&gt;Deploy completato&lt;/AlertTitle&gt;
  &lt;AlertDescription&gt;
    Static build pronta per il publish.
  &lt;/AlertDescription&gt;
&lt;/Alert&gt;</code></pre>
          </CardContent>
        </Card>
      </div>
    </TabsContent>

    <TabsContent value="forms" class="mt-6">
      <Card class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <CardHeader>
          <div class="flex items-center gap-3">
            <div class="flex size-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <SlidersHorizontal class="size-5" />
            </div>
            <div>
              <CardTitle>Form controls</CardTitle>
              <CardDescription>Input reali del registry `shadcn-vue`, utilizzabili nelle pagine Vue del tema.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="grid gap-5 lg:grid-cols-2">
          <div class="space-y-4 rounded-[24px] border border-border/70 bg-background/75 p-5">
            <div class="space-y-2">
              <Label for="project-name">Project name</Label>
              <Input id="project-name" default-value="Static UI Docs" />
            </div>
            <div class="space-y-2">
              <Label for="owner">Owner</Label>
              <Input id="owner" placeholder="design-system@team.dev" />
            </div>
          </div>

          <div class="space-y-4 rounded-[24px] border border-border/70 bg-background/75 p-5">
            <label class="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/80 p-4">
              <Checkbox v-model="updatesEnabled" class="mt-0.5" />
              <span>
                <span class="block text-sm font-medium">Local search attiva</span>
                <span class="block text-sm text-muted-foreground">Mantiene il comportamento nativo di VitePress con una shell custom.</span>
              </span>
            </label>

            <div class="flex items-center justify-between rounded-2xl border border-border/70 bg-card/80 p-4">
              <div>
                <p class="text-sm font-medium">Nightly builds</p>
                <p class="text-sm text-muted-foreground">Abilita anteprime piu frequenti durante lo sviluppo.</p>
              </div>
              <Switch v-model="nightlyBuilds" />
            </div>

            <div class="flex gap-3 pt-2">
              <Button>Salva</Button>
              <Button variant="outline">Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="feedback" class="mt-6">
      <div class="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="flex size-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <BellRing class="size-5" />
              </div>
              <div>
                <CardTitle>Feedback layer</CardTitle>
                <CardDescription>Alert, progress e placeholder per stati di sistema, onboarding e release.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-5">
            <Alert class="border-border/70 bg-background/80">
              <AlertTitle>Deploy completato</AlertTitle>
              <AlertDescription>
                La build statica e pronta e la UI principale e gia allineata al tema custom.
              </AlertDescription>
            </Alert>

            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium">Migrazione tema</span>
                <span class="text-muted-foreground">{{ progress }}%</span>
              </div>
              <Progress :model-value="progress" />
            </div>

            <div class="grid gap-3">
              <Skeleton class="h-4 w-4/5 rounded-full" />
              <Skeleton class="h-4 w-full rounded-full" />
              <Skeleton class="h-24 w-full rounded-[20px]" />
            </div>
          </CardContent>
        </Card>

        <Card class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <CardHeader>
            <CardTitle>Roadmap accordion</CardTitle>
            <CardDescription>Un pattern utile per changelog, release notes e documentazione strutturata.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible default-value="item-1" class="rounded-[24px] border border-border/70 bg-background/75 px-5">
              <AccordionItem
                v-for="(step, index) in releaseSteps"
                :key="step.title"
                :value="`item-${index + 1}`"
              >
                <AccordionTrigger class="text-left font-medium">
                  {{ step.title }}
                </AccordionTrigger>
                <AccordionContent class="text-sm leading-6 text-muted-foreground">
                  {{ step.body }}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  </Tabs>
</template>

