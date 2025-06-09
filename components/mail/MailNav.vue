<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface LinkProp {
  title: string
  label: string
  icon: string
  variant: 'default' | 'ghost'
}

const props = defineProps<{
  isCollapsed: boolean
  links: LinkProp[]
}>()

const emit = defineEmits<{
  (e: 'linkClick', title: string): void
}>()
</script>

<template>
  <div class="group flex flex-col gap-4 py-2">
    <nav class="grid gap-1 px-2">
      <Button
        v-for="link in links"
        :key="link.title"
        :variant="link.variant"
        :class="cn(
          'justify-start',
          props.isCollapsed && 'justify-center',
        )"
        @click="emit('linkClick', link.title)"
      >
        <Icon :name="link.icon" class="mr-2 h-4 w-4" />
        <span v-if="!props.isCollapsed">{{ link.title }}</span>
        <span
          v-if="!props.isCollapsed && link.label"
          :class="cn(
            'ml-auto',
            link.variant === 'default' && 'text-background dark:text-white',
          )"
        >
          {{ link.label }}
        </span>
      </Button>
    </nav>
  </div>
</template>
