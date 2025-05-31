<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import { useMailLogs } from '@/composables/useMailLogs'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useI18n } from 'vue-i18n'

const props = defineProps<MailListProps>()
const emit = defineEmits<{
  (e: 'pageChange', offset: number): void
  (e: 'filterChange', filters: MailLogFilters): void
}>()

const { locale, t } = useI18n()
const { updateFilters: _updateFilters } = useMailLogs()

interface MailItem {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  externalId: string
  from: string
  to: string
  cc: string
  contentTitle: string
  contentBody: string
  modelResponseMail: any | null
  type: string
  offerId: number | null
  customerMailListId: number | null
  supplierOfferId: number | null
  supplierContactId: number | null
  supplierOffer: any | null
  offer: any | null
  customerMailList: any | null
}

interface MailListProps {
  items: MailItem[]
  total: number
  limit: number
  offset: number
}

interface MailLogFilters {
  customerId?: number
  startDate?: string
  endDate?: string
  type?: string
  offerNo?: string
  limit: number
  offset: number
}

const selectedMail = defineModel<string>('selectedMail', { required: false })

// Filter state
const filters = ref<MailLogFilters>({
  customerId: undefined,
  startDate: undefined,
  endDate: undefined,
  type: undefined,
  offerNo: undefined,
  limit: props.limit,
  offset: props.offset,
})

// Mail type options
const mailTypes = [
  'CUSTOMER_NEW_OFFER_REQUEST',
  'CUSTOMER_REQUEST_CORRECTION',
  'CUSTOMER_REQUEST_CORRECTION_REMINDED',
  'CUSTOMER_REQUEST_CORRECTION_FROM_CUSTOMER',
  'FEE_REQUEST_FOR_OFFER',
  'FEE_REQUEST_FOR_OFFER_REMINDED',
  'SUPPLIER_NEW_OFFER',
  'SUPPLIER_REQUEST_OFFER',
  'CUSTOMER_OFFER_RESULT',
  'WAITING_FEE_FOR_OFFER',
  'INTERNAL_INFORMATION',
  'FILE_NOTIFICATION',
  'OTHER',
]

// Calculate total pages
const totalPages = computed(() => {
  const pages = Math.ceil(props.total / props.limit)
  return pages
})

// Handle pagination
function handlePageChange(newOffset: number) {
  filters.value.offset = newOffset
  emit('pageChange', newOffset)
}

function getBadgeVariantFromType(type: string) {
  if (['file'].includes(type.toLowerCase()))
    return 'default'
  return 'secondary'
}

function formatDate(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: locale.value === 'tr' ? tr : undefined,
  })
}

// Handle filter changes
function handleSearch() {
  const newFilters = {
    ...filters.value,
    limit: props.limit,
    offset: props.offset,
  }
  emit('filterChange', newFilters)
}

function handleReset() {
  filters.value = {
    customerId: undefined,
    startDate: undefined,
    endDate: undefined,
    type: undefined,
    offerNo: undefined,
    limit: props.limit,
    offset: 0,
  }
  emit('filterChange', filters.value)
}

// Watch for filter changes
watch(filters, () => {
  handleSearch()
}, { deep: true })

// Watch for prop changes
watch(() => props.offset, (newOffset) => {
  filters.value.offset = newOffset
})

watch(() => props.limit, (newLimit) => {
  filters.value.limit = newLimit
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="h-[calc(100vh-380px)] overflow-y-auto">
      <div class="flex flex-col gap-2 p-4">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold tracking-tight">
              {{ t('email.mail_logs_title') }}
            </h2>
            <p class="text-sm text-muted-foreground">
              {{ t('email.mail_log_subtitle') }}
            </p>
          </div>
        </div>

        <!-- Filters -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-medium">{{ t('mailLogs.filters.customerId') }}</label>
            <Input
              v-model="filters.customerId"
              type="number"
              :placeholder="t('mailLogs.filters.customerIdPlaceholder')"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">{{ t('mailLogs.filters.startDate') }}</label>
            <Input
              v-model="filters.startDate"
              type="date"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">{{ t('mailLogs.filters.endDate') }}</label>
            <Input
              v-model="filters.endDate"
              type="date"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">{{ t('mailLogs.filters.type') }}</label>
            <select
              v-model="filters.type"
              class="w-full border border-input rounded-md bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">
                {{ t('common.all') }}
              </option>
              <option
                v-for="type in mailTypes"
                :key="type"
                :value="type"
              >
                {{ t(`email.mail_types.${type}`) }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">{{ t('mailLogs.filters.offerId') }}</label>
            <Input
              v-model="filters.offerNo"
              :placeholder="t('mailLogs.filters.offerIdPlaceholder')"
            />
          </div>

          <div class="flex items-end gap-2">
            <Button class="flex-1" @click="handleSearch">
              {{ t('common.search') }}
            </Button>
            <Button variant="outline" class="flex-1" @click="handleReset">
              {{ t('common.reset') }}
            </Button>
          </div>
        </div>

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
                    {{ item.from || t('email.offer_display.no_sender') }}
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
                {{ item.contentTitle || t('email.offer_display.no_subject') }}
              </div>
            </div>
            <div class="line-clamp-2 text-xs text-muted-foreground">
              <div class="line-clamp-2" v-html="item.contentBody || t('email.offer_display.no_content')" />
            </div>
            <div class="flex items-center gap-2">
              <Badge :variant="getBadgeVariantFromType(item.type)">
                {{ t(`email.mail_types.${item.type}`) }}
              </Badge>
            </div>
          </button>
        </TransitionGroup>
      </div>
    </div>
    <div class="flex-none border-t bg-background">
      <div class="flex items-center justify-center py-3">
        <Pagination>
          <PaginationList>
            <PaginationListItem :value="0">
              <PaginationPrev
                :disabled="props.offset === 0"
                @click="handlePageChange(props.offset - props.limit)"
              />
            </PaginationListItem>
            <PaginationListItem v-for="page in totalPages" :key="page" :value="page">
              <button
                class="rounded-md px-3 py-1"
                :class="props.offset === (page - 1) * props.limit ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
                @click="handlePageChange((page - 1) * props.limit)"
              >
                {{ page }}
              </button>
            </PaginationListItem>
            <PaginationListItem :value="totalPages + 1">
              <PaginationNext
                :disabled="props.offset + props.limit >= props.total"
                @click="handlePageChange(props.offset + props.limit)"
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
