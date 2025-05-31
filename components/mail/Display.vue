<script lang="ts" setup>
import type { Mail } from './data/mails'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface MailDisplayProps {
  mail: Mail | undefined
}

const props = defineProps<MailDisplayProps>()
const emit = defineEmits(['close'])
const { t } = useI18n()

const mailFallbackName = computed(() => {
  return props.mail?.name
    .split(' ')
    .map(chunk => chunk[0])
    .join('')
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center p-2">
      <div class="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" :disabled="!mail" @click="emit('close')">
              <ArrowLeft class="size-4" />
              <span class="sr-only">{{ t('email.display.back') }}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{{ t('email.display.back') }}</TooltipContent>
        </Tooltip>
      </div>
    </div>
    <Separator />
    <div v-if="mail" class="flex flex-1 flex-col">
      <div class="flex items-start p-4">
        <div class="flex items-start gap-4 text-sm">
          <Avatar>
            <AvatarFallback>
              {{ mailFallbackName }}
            </AvatarFallback>
          </Avatar>
          <div class="grid gap-1">
            <div class="font-semibold">
              {{ mail.name }}
            </div>
            <div class="line-clamp-1 text-xs">
              {{ mail.subject }}
            </div>
            <div class="line-clamp-1 text-xs">
              <span class="font-medium">{{ t('email.display.reply_to') }}</span> {{ mail.email }}
            </div>
          </div>
        </div>
        <div v-if="mail.date" class="ml-auto text-xs text-muted-foreground">
          {{ format(new Date(mail.date), "PPpp") }}
        </div>
      </div>
      <Separator />
      <div class="flex-1 p-4 text-sm">
        <div class="mail-content" v-html="mail.text || t('email.display.no_content')" />
      </div>
      <Separator class="mt-auto" />
    </div>
    <div v-else class="p-8 text-center text-muted-foreground">
      {{ t('email.display.no_message') }}
    </div>
  </div>
</template>

<style scoped>
.mail-content p {
  margin: 0 0 0.5em 0;
}
.mail-content br {
  display: none;
}
.mail-content {
  white-space: normal;
}
</style>
