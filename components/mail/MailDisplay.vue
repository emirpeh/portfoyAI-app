<script setup lang="ts">
import { Button } from '@/components/ui/button'

const props = defineProps<{
  mail: {
    id: string
    from: string
    to: string
    cc: string
    contentTitle: string
    contentBody: string
    type: string
    offerId: number
    createdAt: string
  }
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const cleanedBody = computed(() =>
  props.mail.contentBody.replace(/^&gt;\s?/gm, ''),
)
</script>

<template>
  <div
    class="mx-auto h-full flex flex-col overflow-hidden border rounded-lg shadow-md md:max-w-3xl"
  >
    <!-- Top bar -->
    <div class="flex items-center justify-between border-b px-6 py-4">
      <h2 class="truncate text-xl font-semibold">
        {{ mail.contentTitle }}
      </h2>
      <Button variant="ghost" size="sm" @click="emit('close')">
        Kapat
      </Button>
    </div>

    <!-- Body -->
    <div
      class="max-h-[75vh] max-w-none flex-1 overflow-y-auto overscroll-contain px-6 py-4 prose"
    >
      <div v-html="cleanedBody" />
    </div>
  </div>
</template>
