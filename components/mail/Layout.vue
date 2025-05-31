<script lang="ts" setup>
import type { LinkProp } from '~/components/mail/Nav.vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useMediaQuery } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { cn } from '~/lib/utils'
import ConfigurationSection from './ConfigurationSection.vue'
import MailDisplay from './MailDisplay.vue'
import MailList from './MailList.vue'
import MailNav from './MailNav.vue'
import OfferDisplay from './OfferDisplay.vue'
import OfferList from './OfferList.vue'
import SupplierList from './SupplierList.vue'

interface MailItem {
  id: string
  name: string
  email: string
  subject: string
  text: string
  date: string
  read: boolean
  labels: string[]
  createdAt: string
  from: string
  to: string
  cc: string
  contentTitle: string
  contentBody: string
  type: string
  offerId: number
}

const props = withDefaults(defineProps<{
  mails: any[]
  navCollapsedSize: number
  total: number
  limit: number
  offset: number
  filters: {
    startDate?: string
    endDate?: string
    type?: string
    offerNo?: string
    limit: number
    offset: number
  }
  defaultLayout?: number[]
}>(), {
  defaultLayout: () => [18, 82],
})

const emit = defineEmits<{
  (e: 'pageChange', offset: number): void
  (e: 'filterChange', filters: typeof props.filters): void
}>()

const { t } = useI18n()

// Local copy of filters
const localFilters = ref({ ...props.filters })

// Watch for prop changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

const isCollapsed = ref(false)
const selectedMail = ref<string | undefined>()
const selectedOffer = ref<number | undefined>(undefined)
const searchValue = ref('')
const debouncedSearch = refDebounced(searchValue, 250)

const filteredMailList = computed(() => {
  let output: MailItem[]
  const searchValue = debouncedSearch.value?.trim()
  if (!searchValue) {
    output = props.mails
  }
  else {
    output = props.mails.filter((item) => {
      return item.from.includes(debouncedSearch.value)
        || item.to.includes(debouncedSearch.value)
        || item.contentTitle.includes(debouncedSearch.value)
        || item.contentBody.includes(debouncedSearch.value)
    })
  }
  return output
})

const selectedMailData = computed(() => props.mails.find(item => item.id === selectedMail.value))

const activeTab = ref('offers')

const links = computed<LinkProp[]>(() => [
  {
    title: 'email.tabs.all',
    label: '',
    icon: 'lucide:archive',
    variant: activeTab.value === 'all' ? 'default' : 'ghost',
  },
  {
    title: 'email.tabs.offers',
    label: '',
    icon: 'lucide:alert-circle',
    variant: activeTab.value === 'offers' ? 'default' : 'ghost',
  },
  {
    title: 'email.tabs.suppliers',
    label: '',
    icon: 'lucide:users',
    variant: activeTab.value === 'suppliers' ? 'default' : 'ghost',
  },
  {
    title: 'email.tabs.configuration',
    label: '',
    icon: 'lucide:settings',
    variant: activeTab.value === 'configuration' ? 'default' : 'ghost',
  },
])

function handleLinkClick(title: string) {
  if (title === 'email.tabs.offers') {
    activeTab.value = 'offers'
  }
  else if (title === 'email.tabs.all') {
    activeTab.value = 'all'
  }
  else if (title === 'email.tabs.suppliers') {
    activeTab.value = 'suppliers'
  }
  else if (title === 'email.tabs.configuration') {
    activeTab.value = 'configuration'
  }
  selectedOffer.value = undefined
}

function onCollapse() {
  isCollapsed.value = true
}

function onExpand() {
  isCollapsed.value = false
}

const defaultCollapse = useMediaQuery('(max-width: 768px)')

watch(() => defaultCollapse.value, () => {
  isCollapsed.value = defaultCollapse.value
})

// Handle pagination
function handlePageChange(newOffset: number) {
  emit('pageChange', newOffset)
}

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

// Handle filter changes
function handleSearch() {
  emit('filterChange', localFilters.value)
}

function handleReset() {
  localFilters.value = {
    startDate: undefined,
    endDate: undefined,
    type: undefined,
    offerNo: undefined,
    limit: props.limit,
    offset: 0,
  }
  emit('filterChange', localFilters.value)
}
</script>

<template>
  <ResizablePanelGroup
    id="resize-panel-group-1"
    direction="horizontal"
    class="h-full max-h-[calc(100dvh-53px-3rem)] items-stretch overflow-auto"
  >
    <ResizablePanel
      id="resize-panel-1"
      :default-size="defaultLayout[0]"
      :collapsed-size="navCollapsedSize"
      collapsible
      :min-size="15"
      :max-size="20"
      :class="cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')"
      @expand="onExpand"
      @collapse="onCollapse"
    >
      <Separator />
      <MailNav
        :is-collapsed="isCollapsed"
        :links="links"
        @link-click="handleLinkClick"
      />
      <Separator />
    </ResizablePanel>
    <ResizableHandle id="resize-handle-1" with-handle />
    <ResizablePanel id="resize-panel-2" :default-size="defaultLayout[1]" :min-size="30">
      <Tabs :model-value="activeTab" class="mt-8 h-full flex flex-col">
        <Separator />
        <TabsContent value="all" class="m-0 flex-1">
          <div v-if="selectedMailData">
            <MailDisplay :mail="selectedMailData" @close="selectedMail = ''" />
          </div>
          <div v-else-if="selectedOffer">
            <OfferDisplay :offer-id="selectedOffer" @close="selectedOffer = undefined" />
          </div>
          <div v-else class="h-full flex flex-col">
            <div class="flex-1 p-8 pt-6 space-y-4">
              <div class="flex items-center justify-between space-y-2">
                <h2 class="text-3xl font-bold tracking-tight">
                  {{ t('email.mail_logs_title') }}
                </h2>
              </div>

              <!-- Filters -->
              <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-sm font-medium">{{ t('mailLogs.filters.startDate') }}</label>
                  <Input
                    v-model="localFilters.startDate"
                    type="date"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium">{{ t('mailLogs.filters.endDate') }}</label>
                  <Input
                    v-model="localFilters.endDate"
                    type="date"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium">{{ t('mailLogs.filters.type') }}</label>
                  <select
                    v-model="localFilters.type"
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
                    v-model="localFilters.offerNo"
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

              <div class="flex-1">
                <div class="flex-1">
                  <MailList
                    v-model:selected-mail="selectedMail"
                    :items="filteredMailList"
                    :total="total"
                    :limit="limit"
                    :offset="offset"
                    @page-change="handlePageChange"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="offers" class="m-0 flex-1">
          <div v-if="selectedOffer">
            <OfferDisplay :offer-id="selectedOffer" @close="selectedOffer = undefined" />
            </div>
          <div v-else>
            <OfferList
              v-model:selected-offer="selectedOffer"
              :offers="[]"
              :total="0"
              :limit="10"
              :offset="0"
              @page-change="handlePageChange"
            />
          </div>
        </TabsContent>
        <TabsContent value="suppliers" class="m-0 flex-1">
          <SupplierList
            :suppliers="[]"
            :total="0"
            :limit="10"
            :offset="0"
            @page-change="handlePageChange"
          />
        </TabsContent>
        <TabsContent value="configuration" class="m-0 flex-1">
                <ConfigurationSection />
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
