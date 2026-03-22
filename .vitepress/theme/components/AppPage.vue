<template>
  <div class="px-4 pb-20 pt-[calc(var(--vp-nav-height)+2rem)] max-[960px]:pt-[calc(var(--vp-nav-height)+1.5rem)]">
    <div class="mx-auto max-w-[1180px]">
      <slot name="page-top" />
      <div class="vp-doc rounded-[2rem] border border-border/80 bg-card/88 p-8 shadow-[0_24px_72px_rgba(15,23,42,0.1)]">
        <Content />
      </div>
      <slot name="page-bottom" />
    </div>
  </div>
</template>
