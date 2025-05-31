<script setup lang="ts">
import { CheckCircle, Circle } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import CargoInvoiceDetails from '@/components/positions/components/CargoInvoiceDetails.vue'
import LoadingUnloadingDetails from '@/components/positions/components/LoadingUnloadingDetails.vue'
import PartialLoadsDetails from '@/components/positions/components/PartialLoadsDetails.vue'
import PositionMap from '@/components/positions/components/PositionMap.vue'
import TripDetails from '@/components/positions/components/TripDetails.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePosition } from '@/composables/usePosition'
import { formatDate } from '@/utils/format'
import { useAuth } from '~/composables/useAuth'

interface PositionFile {
  id: string
  fileName: string
  date: string
}

const route = useRoute()
const { t } = useI18n()
const id = route.query.id as string
const { position, loading, error, getPositionFiles, truckLocations, truckLocationsLoading, fetchTruckLocations } = usePosition(id)

// Varsayılan konum değerleri (sadece pozisyon bilgisi yüklenene kadar kullanılacak)
const defaultLoadingLocation: [number, number] = [41.0082, 28.9784] // İstanbul
const defaultUnloadingLocation: [number, number] = [48.8566, 2.3522] // Paris

// Gerçek yükleme ve boşaltma konumları
const loadingLocation = ref(defaultLoadingLocation)
const unloadingLocation = ref(defaultUnloadingLocation)

// Bazı yaygın şehirler için sabit koordinatlar
const knownLocations: Record<string, [number, number]> = {
  // Türkiye
  'istanbul': [41.0082, 28.9784],
  'ankara': [39.9334, 32.8597],
  'izmir': [38.4237, 27.1428],
  'bursa': [40.1885, 29.0610],
  'antalya': [36.8969, 30.7133],

  // Avrupa
  'paris': [48.8566, 2.3522],
  'london': [51.5074, -0.1278],
  'berlin': [52.5200, 13.4050],
  'madrid': [40.4168, -3.7038],
  'rome': [41.9028, 12.4964],
  'amsterdam': [52.3676, 4.9041],
  'brussels': [50.8503, 4.3517],
  'vienna': [48.2082, 16.3738],
  'prague': [50.0755, 14.4378],
  'warsaw': [52.2297, 21.0122],
  'budapest': [47.4979, 19.0402],
  'lisbon': [38.7223, -9.1393],
  'athens': [37.9838, 23.7275],
  'stockholm': [59.3293, 18.0686],
  'copenhagen': [55.6761, 12.5683],
  'oslo': [59.9139, 10.7522],
  'helsinki': [60.1699, 24.9384],
  'dublin': [53.3498, -6.2603],
  'zurich': [47.3769, 8.5417],
  'geneva': [46.2044, 6.1432],
  'milan': [45.4642, 9.1900],
  'barcelona': [41.3851, 2.1734],
  'munich': [48.1351, 11.5820],
  'frankfurt': [50.1109, 8.6821],
  'hamburg': [53.5511, 9.9937],

  // Portekiz şehirleri
  'v.n. famalicao': [41.4087, -8.5200],
  'famalicao': [41.4087, -8.5200],
  'vila nova de famalicao': [41.4087, -8.5200],
  'porto': [41.1579, -8.6291],
  'braga': [41.5454, -8.4265],
  'faro': [37.0193, -7.9304],

  // Diğer
  'new york': [40.7128, -74.0060],
  'los angeles': [34.0522, -118.2437],
  'tokyo': [35.6762, 139.6503],
  'beijing': [39.9042, 116.4074],
  'sydney': [33.8688, 151.2093],
  'dubai': [25.2048, 55.2708],
  'singapore': [1.3521, 103.8198],
  'hong kong': [22.3193, 114.1694],
  'moscow': [55.7558, 37.6173],
  'sao paulo': [23.5505, -46.6333],
  'cairo': [30.0444, 31.2357],
  'johannesburg': [26.2041, 28.0473],
  'mumbai': [19.0760, 72.8777],
  'delhi': [28.6139, 77.2090],
  'shanghai': [31.2304, 121.4737],
  'seoul': [37.5665, 126.9780],
}

// Konum bilgilerini güncelleyen fonksiyon
async function updateLocationCoordinates() {
  if (!position.value)
    return

  try {
    // Yükleme noktası koordinatlarını al
    if (position.value.placeOfLoading) {
      // Özel durumları kontrol et
      const specialLoadingCase = handleSpecialLocationCases(position.value.placeOfLoading, position.value.countryOfLoading)
      if (specialLoadingCase) {
        loadingLocation.value = specialLoadingCase
      }
      else {
        // Önce bilinen konumlar listesinde ara
        const loadingLocationLower = position.value.placeOfLoading.toLowerCase().trim()
        const knownLoadingCoords = getKnownLocationCoordinates(loadingLocationLower)

        if (knownLoadingCoords) {
          loadingLocation.value = knownLoadingCoords
        }
        else {
          // Bilinen konumlar listesinde yoksa API'den al
          // Ülke bilgisini de ekleyerek daha doğru sonuç almaya çalışalım
          const loadingQuery = `${position.value.placeOfLoading}, ${position.value.countryOfLoading}`

          const loadingCoords = await getCoordinatesFromLocationName(loadingQuery)

          if (loadingCoords) {
            loadingLocation.value = loadingCoords
          }
          else {
            // API'den sonuç alamazsak, sadece şehir adıyla tekrar deneyelim
            const cityOnlyQuery = position.value.placeOfLoading

            const cityOnlyCoords = await getCoordinatesFromLocationName(cityOnlyQuery)

            if (cityOnlyCoords) {
              loadingLocation.value = cityOnlyCoords
            }
            else {
              // Varsayılan değeri kullan
            }
          }
        }
      }
    }

    // Boşaltma noktası koordinatlarını al
    if (position.value.placeOfUnloading) {
      // Özel durumları kontrol et
      const specialUnloadingCase = handleSpecialLocationCases(position.value.placeOfUnloading, position.value.countryOfUnloading)
      if (specialUnloadingCase) {
        unloadingLocation.value = specialUnloadingCase
      }
      else {
        // Önce bilinen konumlar listesinde ara
        const unloadingLocationLower = position.value.placeOfUnloading.toLowerCase().trim()
        const knownUnloadingCoords = getKnownLocationCoordinates(unloadingLocationLower)

        if (knownUnloadingCoords) {
          unloadingLocation.value = knownUnloadingCoords
        }
        else {
          // Bilinen konumlar listesinde yoksa API'den al
          // Ülke bilgisini de ekleyerek daha doğru sonuç almaya çalışalım
          const unloadingQuery = `${position.value.placeOfUnloading}, ${position.value.countryOfUnloading}`

          const unloadingCoords = await getCoordinatesFromLocationName(unloadingQuery)

          if (unloadingCoords) {
            unloadingLocation.value = unloadingCoords
          }
          else {
            // API'den sonuç alamazsak, sadece şehir adıyla tekrar deneyelim
            const cityOnlyQuery = position.value.placeOfUnloading

            const cityOnlyCoords = await getCoordinatesFromLocationName(cityOnlyQuery)

            if (cityOnlyCoords) {
              unloadingLocation.value = cityOnlyCoords
            }
            else {
              // Varsayılan değeri kullan
            }
          }
        }
      }
    }
  }
  catch {
    // Error handling without console.error
  }
}

// Özel durum kontrolü
function handleSpecialLocationCases(locationName: string, countryName: string): [number, number] | null {
  const locationLower = locationName.toLowerCase().trim()
  const countryLower = countryName.toLowerCase().trim()

  // V.N. FAMALICAO, Portekiz için özel durum
  if ((locationLower === 'v.n. famalicao' || locationLower.includes('famalicao'))
    && (countryLower === 'portugal' || countryLower === 'portekiz')) {
    return [41.4087, -8.5200]
  }

  // Diğer özel durumlar buraya eklenebilir

  return null
}

// Bilinen bir konum için koordinatları döndürür
function getKnownLocationCoordinates(locationName: string): [number, number] | null {
  // Tam eşleşme kontrolü
  if (locationName in knownLocations) {
    return knownLocations[locationName]
  }

  // Kısmi eşleşme kontrolü
  for (const [key, coords] of Object.entries(knownLocations)) {
    if (locationName.includes(key) || key.includes(locationName)) {
      return coords
    }
  }

  return null
}

// Konum adından koordinat almak için yardımcı fonksiyon
async function getCoordinatesFromLocationName(locationName: string): Promise<[number, number] | null> {
  try {
    // Nominatim API'ye istek gönder
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1&addressdetails=1`

    const response = await fetch(url)
    const data = await response.json()

    if (data && data.length > 0) {
      const lat = Number.parseFloat(data[0].lat)
      const lon = Number.parseFloat(data[0].lon)

      if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
        return [lat, lon]
      }
    }

    return null
  }
  catch {
    return null
  }
}

const activeTab = ref('trip-details')

const tabs = [
  { id: 'trip-details', label: t('positions.tabs.tripDetails') },
  { id: 'cargo-invoice', label: t('positions.tabs.cargoInvoice') },
  { id: 'partial-loads', label: t('positions.tabs.partialLoads') },
]

const statusSteps = [
  { id: 'created', label: t('positions.status.steps.created'), date: null },
  { id: 'loaded', label: t('positions.status.steps.loaded'), date: null },
  { id: 'departed', label: t('positions.status.steps.departed'), date: null },
  { id: 'onTheWay', label: t('positions.status.steps.onTheWay'), date: null },
  { id: 'onDelivery', label: t('positions.status.steps.onDelivery'), date: null },
  { id: 'delivered', label: t('positions.status.steps.delivered'), date: null },
]

function parseStatus(status: string) {
  const statusMap: { [key: string]: string } = {
    'Pozisyon Oluşturuldu': 'created',
    'Yüklendi / Loaded': 'loaded',
    'Çıktı / Departed': 'departed',
    'Yolda / On the Way': 'onTheWay',
    'Dağıtımda / On Delivery': 'onDelivery',
    'Teslim Edildi / Delivered': 'delivered',
  }
  return statusMap[status] || 'created'
}

function getCurrentStepIndex(status: string) {
  const currentStatus = parseStatus(status)
  const statusOrder = ['created', 'loaded', 'departed', 'onTheWay', 'onDelivery', 'delivered']
  return statusOrder.indexOf(currentStatus)
}

const files = ref<PositionFile[]>([])
const filesLoading = ref(false)

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

function handleFileDownload(fileId: string) {
  const auth = useAuth()
  if (!auth.accessToken) {
    console.error('No access token available')
    return
  }

  if (!position.value?.positionNo) {
    console.error('Position number not available')
    return
  }

  // Şifre olarak pozisyon numarası + dosya ID'si kullanılıyor
  const password = `${position.value.positionNo}${fileId}`
  const downloadUrl = `https://customer.maxitransport.net/api/download/${fileId}`

  // POST isteği ile şifreyi gönder
  fetch(downloadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth.accessToken}`,
    },
    body: JSON.stringify({ password }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Şifre yanlış veya yetkiniz yok')
        }
        else if (response.status === 404) {
          throw new Error('Dosya bulunamadı')
        }
        throw new Error('Dosya indirme hatası')
      }
      return response.blob()
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `file-${fileId}` // Dosya adı API'den gelmiyorsa bu şekilde kullanılabilir
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
    .catch((error) => {
      console.error('Error downloading file:', error)
    })
}

onMounted(async () => {
  // Kamyon konumlarını getir
  await fetchTruckLocations()
})

// Pozisyon bilgisi değiştiğinde konum koordinatlarını güncelle
watch(() => position.value, async (newPosition) => {
  if (newPosition) {
    await updateLocationCoordinates()
    fetchFiles()
  }
}, { immediate: true })
</script>

<template>
  <div class="detail-container py-6">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="h-8 w-8 animate-spin border-b-2 border-primary rounded-full" />
    </div>

    <Alert v-else-if="error" variant="destructive" class="my-8">
      <AlertTitle>{{ t('common.error') }}</AlertTitle>
      <AlertDescription>
        {{ t('positions.errorLoading') }}
      </AlertDescription>
    </Alert>

    <template v-else-if="position">
      <div class="detail-grid mb-4">
        <div class="detail-content">
          <Card class="overflow-hidden border rounded-lg shadow-md" style="background-color: white; border-color: #ffde59; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05)">
            <CardHeader class="pb-3" style="background-color: #ffde59">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <CardTitle class="text-xl" style="color: #343a40">
                    {{ t('positions.details') }} - {{ id }}
                  </CardTitle>
                  <div class="flex items-center text-xs space-x-2" style="color: #343a40">
                    <span>•</span>
                    <span>{{ t(`positions.positionType.${position.positionType}`) }}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <!-- Route Indicator -->
              <div class="mb-6">
                <div class="flex items-center justify-center py-3">
                  <div class="rounded-full px-3 py-1 text-sm font-medium shadow-sm" style="color: #343a40; background-color: #ffde59; border: 1px solid #ffde59;">
                    {{ position.placeOfLoading }}
                  </div>
                  <div class="relative mx-3 h-[2px] flex-1" style="background-color: #343a40;">
                    <div class="absolute inset-0" style="background-color: #ffde59;" />
                    <div class="absolute right-0 top-1/2 h-2 w-2 rotate-45 transform -translate-x-1/2 -translate-y-1/2" style="background-color: #ffde59;" />
                  </div>
                  <div class="rounded-full px-3 py-1 text-sm font-medium shadow-sm" style="color: #343a40; background-color: #ffde59; border: 1px solid #ffde59;">
                    {{ position.placeOfUnloading }}
                  </div>
                </div>
                <div class="mt-1 flex justify-between text-xs">
                  <div style="color: #343a40">
                    {{ position.countryOfLoading }}
                  </div>
                  <div style="color: #343a40">
                    {{ position.countryOfUnloading }}
                  </div>
                </div>
              </div>

              <!-- Status Steps -->
              <div class="relative">
                <div class="absolute left-0 top-[21px] h-[2px] w-full" style="background-color: #343a40;">
                  <div
                    class="absolute left-0 top-0 h-full transition-all duration-300"
                    style="background-color: #ffde59;"
                    :style="{ width: `${(getCurrentStepIndex(position.loadingStatus) / (statusSteps.length - 1)) * 100}%` }"
                  />
                </div>
                <!-- Status Steps -->
                <div class="relative flex justify-between">
                  <div
                    v-for="(step, index) in statusSteps"
                    :key="step.id"
                    class="flex flex-col items-center px-2"
                  >
                    <div
                      class="mb-2 h-9 w-9 flex items-center justify-center border-3 rounded-full transition-all duration-300"
                      :style="{
                        'background-color': getCurrentStepIndex(position.loadingStatus) > index ? '#343a40' : getCurrentStepIndex(position.loadingStatus) === index ? '#343a40' : 'white',
                        'border-color': getCurrentStepIndex(position.loadingStatus) > index ? '#343a40' : getCurrentStepIndex(position.loadingStatus) === index ? '#343a40' : '#343a40',
                      }"
                    >
                      <img
                        v-if="getCurrentStepIndex(position.loadingStatus) === index"
                        src="/favicon.webp"
                        class="h-7 w-7 rounded-full"
                        alt="current"
                      >
                      <CheckCircle
                        v-else-if="getCurrentStepIndex(position.loadingStatus) > index"
                        class="h-7 w-7"
                        style="color: white; stroke-width: 3"
                      />
                      <Circle
                        v-else
                        class="h-7 w-7"
                        style="color: #343a40; stroke-width: 3"
                      />
                    </div>
                    <div
                      class="text-center text-xs font-medium"
                      :style="{
                        color: getCurrentStepIndex(position.loadingStatus) > index ? '#343a40' : getCurrentStepIndex(position.loadingStatus) === index ? '#ffde59' : '#343a40',
                      }"
                    >
                      {{ step.label }}
                    </div>
                    <div
                      class="mt-0.5 text-[11px]"
                      :style="{
                        color: getCurrentStepIndex(position.loadingStatus) > index ? '#343a40' : getCurrentStepIndex(position.loadingStatus) === index ? '#ffde59' : '#343a40',
                      }"
                    >
                      {{ step.date }}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Tabs Section -->
          <div class="mt-4">
            <Tabs v-model="activeTab" class="space-y-3">
              <TabsList class="w-full justify-start border-b" style="background-color: #343a40; border-color: #343a40;">
                <TabsTrigger
                  v-for="tab in tabs"
                  :key="tab.id"
                  :value="tab.id"
                  class="text-xs"
                  :class="{
                    'bg-[#ffde59]': activeTab === tab.id,
                    'hover:bg-[#ffde59]/50': activeTab !== tab.id,
                  }"
                  :style="{
                    color: activeTab === tab.id ? '#343a40' : 'white',
                  }"
                >
                  {{ tab.label }}
                </TabsTrigger>
              </TabsList>

              <!-- Tab Contents -->
              <TabsContent value="trip-details" class="rounded-lg p-1" style="background-color: #343a40">
                <TripDetails :position-id="position.positionNo" />
              </TabsContent>

              <TabsContent value="cargo-invoice" class="rounded-lg p-1" style="background-color: #343a40">
                <CargoInvoiceDetails :position-id="position.positionNo" />
              </TabsContent>

              <TabsContent value="loading-unloading" class="rounded-lg p-1" style="background-color: #343a40">
                <LoadingUnloadingDetails />
              </TabsContent>

              <TabsContent value="partial-loads" class="rounded-lg p-1" style="background-color: #343a40">
                <PartialLoadsDetails />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <!-- Sağ taraf - Map -->
        <div>
          <Card class="overflow-hidden border rounded-lg shadow-md" style="background-color: white; border-color: #ffde59; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05)">
            <CardHeader style="background-color: #ffde59">
              <CardTitle class="text-sm" style="color: #343a40">
                {{ t('positions.map.title') }}
              </CardTitle>
              <div v-if="truckLocationsLoading" class="text-xs" style="color: #343a40">
                Loading truck locations...
              </div>
            </CardHeader>
            <CardContent class="h-[300px]">
              <PositionMap
                :loading-location="loadingLocation"
                :unloading-location="unloadingLocation"
                :truck-locations="truckLocations"
              />
            </CardContent>
          </Card>

          <!-- Files Section -->
          <Card class="mt-4 overflow-hidden border rounded-lg shadow-md" style="background-color: white; border-color: #ffde59; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05)">
            <CardHeader style="background-color: #ffde59">
              <div class="flex items-center justify-between">
                <CardTitle class="text-sm" style="color: #343a40">
                  {{ t('positions.files.title') }}
                </CardTitle>
                <span class="text-xs" style="color: #343a40">
                  {{ files.length }} {{ t('positions.files.count') }}
                </span>
              </div>
            </CardHeader>
            <CardContent class="h-[325px] overflow-y-auto pt-6">
              <div v-if="filesLoading" class="flex items-center justify-center py-3">
                <div class="h-5 w-5 animate-spin border-b-2 rounded-full" style="border-color: #ffde59" />
              </div>
              <div v-else class="space-y-1.5">
                <div
                  v-for="file in files"
                  :key="file.id"
                  class="file-hover flex cursor-pointer items-center justify-between border rounded-md p-2 transition-all duration-200"
                  style="border-color: #343a40; background-color: white; box-shadow: 0 1px 2px rgba(0,0,0,0.05)"
                  @click="handleFileDownload(file.id)"
                >
                  <div class="flex items-center space-x-2">
                    <nuxt-icon name="heroicons:document" class="h-4 w-4" style="color: #343a40" />
                    <div>
                      <div class="text-xs font-medium" style="color: #343a40">
                        {{ file.fileName }}
                      </div>
                      <div class="text-[10px]" style="color: #343a40">
                        {{ formatDate(file.date) }}
                      </div>
                    </div>
                  </div>
                  <nuxt-icon name="heroicons:arrow-down" class="h-3 w-3" style="color: #343a40" />
                </div>
                <div v-if="!files.length" class="py-3 text-center text-xs" style="color: #343a40">
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
.detail-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.status-line {
  height: 2px;
  background: #e5e7eb;
  flex: 1;
  margin: 0 4px;
}

.status-line.active {
  background: #3b82f6;
}

.file-hover:hover {
  background-color: #ffde59 !important;
  border-color: #ffde59 !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-1px);
}
</style>
