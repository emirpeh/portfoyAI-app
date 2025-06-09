<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

const props = defineProps<{
  items: any[]
  total: number
  limit: number
  offset: number
}>()

const emit = defineEmits<{
  (e: 'pageChange', offset: number): void
  (e: 'update:selectedMail', mailId: string): void
}>()

const selectedMail = defineModel<string>('selectedMail', { required: false })

function formatDate(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: tr,
  })
}

function getBadgeVariantFromType(type: string) {
  if (['file'].includes(type.toLowerCase()))
    return 'default'
  return 'secondary'
}

// Calculate total pages
const totalPages = computed(() => {
  const pages = Math.ceil(props.total / props.limit)
  return Array.from({ length: pages }, (_, i) => i + 1)
})

// Handle pagination
function handlePageChange(newOffset: number) {
  if (newOffset < 0 || newOffset >= props.total)
    return
  emit('pageChange', newOffset)
}
</script>

<template>
  <div class="mt-4 h-full flex flex-col border rounded-lg bg-background">
    <div class="max-h-[450px] flex-1 overflow-y-auto">
      <div class="flex flex-col gap-2 p-4">
        <!-- Mail List -->
        <TransitionGroup name="list" appear>
          <button
            v-for="item of items"
            :key="item.id"
            :class="cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
              selectedMail === item.id && 'bg-muted',
            )"
            @click="selectedMail = item.id"
          >
            <div class="w-full flex flex-col gap-1">
              <div class="flex items-center">
                <div class="flex items-center gap-2">
                  <div class="font-semibold">
                    {{ item.from || 'Gönderen Yok' }}
                  </div>
                </div>
                <div
                  :class="cn(
                    'ml-auto text-xs',
                    selectedMail === item.id
                      ? 'text-foreground'
                      : 'text-muted-foreground',
                  )"
                >
                  {{ formatDate(new Date(item.createdAt)) }}
                </div>
              </div>

              <div class="text-xs font-medium">
                {{ item.contentTitle || 'Konu Yok' }}
              </div>
            </div>
            <div class="line-clamp-2 text-xs text-muted-foreground">
              <div class="line-clamp-2" v-html="item.contentBody || 'İçerik Yok'" />
            </div>
            <div class="flex items-center gap-2">
              <Badge :variant="getBadgeVariantFromType(item.type)">
                {{ item.type }}
              </Badge>
            </div>
          </button>
        </TransitionGroup>
      </div>
    </div>
    <div class="border-t bg-background p-4">
      <div class="flex items-center justify-center gap-4">
        <span class="text-sm text-muted-foreground">
          Toplam {{ total }} sonuçtan {{ items.length }} tanesi gösteriliyor.
        </span>
        <Pagination>
          <PaginationList>
            <PaginationListItem :value="0">
              <PaginationPrev
                :disabled="offset === 0"
                @click="handlePageChange(offset - limit)"
              />
            </PaginationListItem>
            <PaginationListItem v-for="page in totalPages" :key="page" :value="page">
              <button
                class="rounded-md px-3 py-1"
                :class="offset === (page - 1) * limit ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
                @click="handlePageChange((page - 1) * limit)"
              >
                {{ page }}
              </button>
            </PaginationListItem>
            <PaginationListItem :value="totalPages.length + 1">
              <PaginationNext
                :disabled="offset + limit >= total"
                @click="handlePageChange(offset + limit)"
              />
            </PaginationListItem>
          </PaginationList>
        </Pagination>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.list-leave-active {
  position: absolute;
}
</style>
