<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div class="flex items-center justify-center">
    <Loader2
      class="animate-spin"
      :class="{
        'h-4 w-4': size === 'sm',
        'h-6 w-6': size === 'md' || !size,
        'h-8 w-8': size === 'lg',
      }"
    />
  </div>
</template>
