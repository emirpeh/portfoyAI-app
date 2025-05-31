<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'

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
const { t } = useI18n()

const cleanedBody = computed(() =>
  props.mail.contentBody.replace(/^&gt;\s?/gm, ''),
)
</script>

<template>
  <div class="h-full flex flex-col md:max-w-3xl mx-auto
              border rounded-lg shadow-md overflow-hidden">

    <!-- Top bar -->
    <div class="flex items-center justify-between px-6 py-4 border-b">
      <h2 class="text-xl font-semibold truncate">
        {{ mail.contentTitle }}
      </h2>
      <Button variant="ghost" size="sm" @click="emit('close')">
        {{ t('common.close') }}
      </Button>
    </div>


    <!-- Body -->
    <div class="flex-1 overflow-y-auto overscroll-contain
    px-6 py-4 prose max-w-none max-h-[75vh]">
      <div v-html="cleanedBody" />
    </div>
  </div>
</template>

