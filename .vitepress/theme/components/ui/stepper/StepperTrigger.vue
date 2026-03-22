<script setup>
import { reactiveOmit } from "@vueuse/core";

import { StepperTrigger, useForwardProps } from "reka-ui";
import { cn } from '@/.vitepress/theme/lib';

const props = defineProps({
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <StepperTrigger
    v-bind="forwarded"
    :class="
      cn(
        'p-2 flex flex-col items-center text-center gap-2 rounded-md',
        props.class,
      )
    "
  >
    <slot />
  </StepperTrigger>
</template>
