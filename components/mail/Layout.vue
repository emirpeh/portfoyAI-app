<script lang="ts" setup>
import type { LinkProp } from '@/components/mail/MailNav.vue'

import { useMediaQuery } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent } from '@/components/ui/tabs'
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
    title: 'Tümü',
    label: '',
    icon: 'lucide:archive',
    variant: activeTab.value === 'all' ? 'default' : 'ghost',
  },
  {
    title: 'Teklifler',
    label: '',
    icon: 'lucide:alert-circle',
    variant: activeTab.value === 'offers' ? 'default' : 'ghost',
  },
  {
    title: 'Tedarikçiler',
    label: '',
    icon: 'lucide:users',
    variant: activeTab.value === 'suppliers' ? 'default' : 'ghost',
  },
  {
    title: 'Yapılandırma',
    label: '',
    icon: 'lucide:settings',
    variant: activeTab.value === 'configuration' ? 'default' : 'ghost',
  },
])

function handleLinkClick(title: string) {
  if (title === 'Teklifler') {
    activeTab.value = 'offers'
  }
  else if (title === 'Tümü') {
    activeTab.value = 'all'
  }
  else if (title === 'Tedarikçiler') {
    activeTab.value = 'suppliers'
  }
  else if (title === 'Yapılandırma') {
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
                  Mail Kayıtları
                </h2>
              </div>

              <!-- Filters -->
              <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-sm font-medium">Başlangıç Tarihi</label>
                  <Input
                    v-model="localFilters.startDate"
                    type="date"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium">Bitiş Tarihi</label>
                  <Input
                    v-model="localFilters.endDate"
                    type="date"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium">Mail Tipi</label>
                  <Select v-model="localFilters.type">
                    <SelectTrigger>
                      <SelectValue placeholder="Mail Tipi Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="type in mailTypes" :key="type" :value="type">
                        {{ type }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium">Teklif Numarası</label>
                  <Input
                    v-model="localFilters.offerNo"
                    placeholder="Teklif numarası girin..."
                  />
                </div>
              </div>
              <div class="flex justify-end gap-2">
                <Button @click="handleSearch">
                  Ara
                </Button>
                <Button variant="outline" @click="handleReset">
                  Sıfırla
                </Button>
              </div>
            </div>
            <div class="flex-1 px-4">
              <MailList v-model:selected-mail="selectedMail" :items="filteredMailList" :total="total" :limit="limit" :offset="offset" @page-change="handlePageChange" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="offers" class="m-0 flex-1">
          <div v-if="selectedOffer">
            <OfferDisplay :offer-id="selectedOffer" @close="selectedOffer = undefined" />
          </div>
          <div v-else class="h-full flex flex-col">
            <div class="flex-1 p-8 pt-6 space-y-4">
              <div class="flex items-center justify-between space-y-2">
                <h2 class="text-3xl font-bold tracking-tight">
                  Teklifler
                </h2>
              </div>
              <OfferList @select-offer="selectedOffer = $event" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="suppliers" class="m-0 flex-1">
          <div class="h-full flex flex-col">
            <div class="flex-1 p-8 pt-6 space-y-4">
              <div class="flex items-center justify-between space-y-2">
                <h2 class="text-3xl font-bold tracking-tight">
                  Tedarikçiler
                </h2>
              </div>
              <SupplierList />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="configuration" class="m-0 flex-1">
          <div class="h-full flex flex-col">
            <div class="flex-1 p-8 pt-6 space-y-4">
              <div class="flex items-center justify-between space-y-2">
                <h2 class="text-3xl font-bold tracking-tight">
                  Yapılandırma
                </h2>
              </div>
              <ConfigurationSection />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
