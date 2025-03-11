<script setup lang="ts">
import CargoInvoiceDetails from '@/components/positions/components/CargoInvoiceDetails.vue'
import LoadingUnloadingDetails from '@/components/positions/components/LoadingUnloadingDetails.vue'
import PartialLoadsDetails from '@/components/positions/components/PartialLoadsDetails.vue'
import PositionMap from '@/components/positions/components/PositionMap.vue'
import TripDetails from '@/components/positions/components/TripDetails.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePosition } from '@/composables/usePosition'
import { formatDate } from '@/utils/format'
import { CheckCircle, Circle } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

interface PositionFile {
  id: string
  fileName: string
  date: string
}

const route = useRoute()
const { t } = useI18n()
const id = route.query.id as string
const { position, loading, error, getPositionFiles, truckLocations, truckLocationsLoading } = usePosition(id)

const defaultLoadingLocation: [number, number] = [41.0082, 28.9784]
const defaultUnloadingLocation: [number, number] = [48.8566, 2.3522]

// Aktif sekme kontrolü
const activeTab = ref('trip-details')

// Sekme listesi
const tabs = [
  { id: 'trip-details', label: t('positions.tabs.tripDetails') },
  { id: 'cargo-invoice', label: t('positions.tabs.cargoInvoice') },
  { id: 'loading-unloading', label: t('positions.tabs.loadingUnloading') },
  { id: 'partial-loads', label: t('positions.tabs.partialLoads') },
]

// Status mapping and helper functions
const statusSteps = [
  { id: 'created', label: t('positions.status.steps.created'), date: null },
  { id: 'transit', label: t('positions.status.steps.transit'), date: null },
  { id: 'delivery', label: t('positions.status.steps.delivery'), date: null },
  { id: 'delivered', label: t('positions.status.steps.delivered'), date: null },
]

function parseStatus(status: string) {
  const statusMap: { [key: string]: string } = {
    'Pozisyon Oluşturuldu': 'created',
    'Yolda': 'transit',
    'On the Way': 'transit',
    'Dağıtımda': 'delivery',
    'On Delivery': 'delivery',
    'Teslim Edildi': 'delivered',
    'Delivered': 'delivered',
  }
  return statusMap[status] || 'created'
}

function getCurrentStepIndex(status: string) {
  const currentStatus = parseStatus(status)
  const statusOrder = ['created', 'transit', 'delivery', 'delivered']
  return statusOrder.indexOf(currentStatus)
}

// Files state
const files = ref<PositionFile[]>([])
const filesLoading = ref(false)

// Fetch files
async function fetchFiles() {
  if (!position.value?.positionNo) {
    return
  }

  filesLoading.value = true
  try {
    const data = await getPositionFiles()
    files.value = data as unknown as PositionFile[]
  }
  catch (error) {
    console.error('Error fetching files:', error)
    files.value = []
  }
  finally {
    filesLoading.value = false
  }
}

// Handle file download
function handleFileDownload(fileId: string) {
  const auth = useAuth()
  if (!auth.accessToken) {
    console.error('No access token available')
    return
  }

  const downloadUrl = `https://localhost:4000/api/download/${fileId}`
  const link = document.createElement('a')
  link.href = downloadUrl
  link.target = '_blank'

  // Add authorization header
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${auth.accessToken}`)

  fetch(downloadUrl, {
    headers,
  })
    .then(response => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      link.href = url
      link.click()
      window.URL.revokeObjectURL(url)
    })
    .catch((error) => {
      console.error('Error downloading file:', error)
    })
}

// Watch for position changes to fetch files
watch(() => position.value?.positionNo, (newPositionNo) => {
  if (newPositionNo) {
    fetchFiles()
  }
}, { immediate: true })
</script>

<template>
  <div class="py-6 container space-y-6">
    <!-- Yükleniyor durumu -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="h-8 w-8 animate-spin border-b-2 border-primary rounded-full" />
    </div>

    <!-- Hata durumu -->
    <Alert v-else-if="error" variant="destructive" class="my-8">
      <AlertTitle>{{ t('common.error') }}</AlertTitle>
      <AlertDescription>
        {{ t('positions.errorLoading') }}
      </AlertDescription>
    </Alert>

    <!-- Pozisyon detayları -->
    <template v-else-if="position">
      <!-- Top Grid - Position Details and Map -->
      <div class="grid grid-cols-3 gap-6">
        <!-- Sol taraf - Position Details -->
        <div class="col-span-2">
          <Card>
            <CardHeader class="pb-4">
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <CardTitle class="text-2xl">
                    {{ t('positions.details') }} - {{ id }}
                  </CardTitle>
                  <div class="flex items-center text-sm text-muted-foreground space-x-2">
                    <span>•</span>
                    <span>{{ position.positionType }}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <!-- Status Timeline -->
              <div class="mb-6">
                <div class="relative">
                  <!-- Progress Line -->
                  <div class="absolute left-0 top-5 h-0.5 w-full bg-gray-200">
                    <div
                      class="absolute left-0 top-0 h-full bg-blue-500"
                      :style="{ width: `${(getCurrentStepIndex(position.status) / (statusSteps.length - 1)) * 100}%` }"
                    />
                  </div>
                  <!-- Status Steps -->
                  <div class="relative flex justify-between">
                    <div
                      v-for="(step, index) in statusSteps"
                      :key="step.id"
                      class="flex flex-col items-center"
                    >
                      <div
                        class="mb-2 h-10 w-10 flex items-center justify-center rounded-full bg-white"
                        :class="{
                          'text-blue-500': getCurrentStepIndex(position.status) >= index,
                          'text-gray-300': getCurrentStepIndex(position.status) < index,
                        }"
                      >
                        <CheckCircle v-if="getCurrentStepIndex(position.status) >= index" class="h-8 w-8" />
                        <Circle v-else class="h-8 w-8" />
                      </div>
                      <div class="text-sm font-medium">
                        {{ step.label }}
                      </div>
                      <div class="mt-1 text-xs text-gray-500">
                        {{ step.date }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Position Details Grid -->
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-1">
                  <Label>{{ t('positions.columns.positionNo') }}</Label>
                  <div class="font-medium">
                    {{ position.positionNo }}
                  </div>
                </div>
                <div class="space-y-1">
                  <Label>{{ t('positions.columns.partialNo') }}</Label>
                  <div class="font-medium">
                    {{ position.partialNo }}
                  </div>
                </div>
                <div class="space-y-1">
                  <Label>{{ t('positions.columns.customer') }}</Label>
                  <div class="font-medium">
                    {{ position.customer }}
                  </div>
                </div>
                <div class="space-y-1">
                  <Label>{{ t('positions.columns.salesRep') }}</Label>
                  <div class="font-medium">
                    {{ position.salesRep }}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sağ taraf - Map -->
        <div class="col-span-1">
          <Card class="h-full">
            <CardHeader>
              <CardTitle>{{ t('positions.map.title') }}</CardTitle>
              <div v-if="truckLocationsLoading" class="text-sm text-muted-foreground">
                Loading truck locations...
              </div>
            </CardHeader>
            <CardContent class="h-[300px]">
              <PositionMap
                :loading-location="defaultLoadingLocation"
                :unloading-location="defaultUnloadingLocation"
                :truck-locations="truckLocations.filter(loc => loc.lastLocation)"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-3 mt-6 gap-6">
        <!-- Sol taraf - Tabs -->
        <div class="col-span-2">
          <Tabs v-model="activeTab" class="space-y-4">
            <TabsList class="w-full justify-start">
              <TabsTrigger
                v-for="tab in tabs"
                :key="tab.id"
                :value="tab.id"
              >
                {{ tab.label }}
              </TabsTrigger>
            </TabsList>

            <!-- Tab Contents -->
            <TabsContent value="trip-details">
              <TripDetails :position-id="position.positionNo" />
            </TabsContent>

            <TabsContent value="cargo-invoice">
              <CargoInvoiceDetails :position-id="position.positionNo" />
            </TabsContent>

            <TabsContent value="loading-unloading">
              <LoadingUnloadingDetails />
            </TabsContent>

            <TabsContent value="partial-loads">
              <PartialLoadsDetails />
            </TabsContent>
          </Tabs>
        </div>

        <!-- Sağ taraf - Files -->
        <div class="col-span-1">
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle>{{ t('positions.files.title') }}</CardTitle>
                <span class="text-sm text-muted-foreground">
                  {{ files.length }} {{ t('positions.files.count') }}
                </span>
              </div>
            </CardHeader>
            <CardContent class="h-[300px] overflow-auto">
              <div v-if="filesLoading" class="flex items-center justify-center py-4">
                <div class="h-6 w-6 animate-spin border-b-2 border-primary rounded-full" />
              </div>
              <div v-else class="space-y-2">
                <div
                  v-for="file in files"
                  :key="file.id"
                  class="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-gray-50"
                  @click="handleFileDownload(file.id)"
                >
                  <div class="flex items-center space-x-3">
                    <nuxt-icon name="heroicons:document" class="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div class="font-medium">
                        {{ file.fileName }}
                      </div>
                      <div class="text-xs text-muted-foreground">
                        {{ formatDate(file.date) }}
                      </div>
                    </div>
                  </div>
                  <nuxt-icon name="heroicons:arrow-down" class="h-4 w-4 text-muted-foreground" />
                </div>
                <div v-if="!files.length" class="py-4 text-center text-sm text-muted-foreground">
                  {{ t('positions.files.noFiles') }}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.status-line {
  height: 2px;
  background: #e5e7eb;
  flex: 1;
  margin: 0 4px;
}

.status-line.active {
  background: #3b82f6;
}
</style>
