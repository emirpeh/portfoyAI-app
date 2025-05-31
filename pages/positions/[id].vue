<script setup lang="ts">
import CargoInvoiceDetails from '@/components/positions/components/CargoInvoiceDetails.vue'
import LoadingUnloadingDetails from '@/components/positions/components/LoadingUnloadingDetails.vue'
import PartialLoadsDetails from '@/components/positions/components/PartialLoadsDetails.vue'
import TripDetails from '@/components/positions/components/TripDetails.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
// URL'den gelen parametreyi decode et
const encodedId = route.params.id as string
const positionId = decodeURIComponent(encodedId)

// Aktif sekme kontrolü
const activeTab = ref('trip-details')

// Sekme listesi
const tabs = [
  { id: 'trip-details', label: t('positions.tabs.tripDetails') },
  { id: 'cargo-invoice', label: t('positions.tabs.cargoInvoice') },
  { id: 'partial-loads', label: t('positions.tabs.partialLoads') },
]

const { position, loading, error } = usePosition(positionId)
</script>

<template>
  <div class="py-6 container space-y-6">
    <!-- Yükleniyor durumu -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Spinner class="h-8 w-8" />
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
      <!-- Üst Bilgi Kartı -->
      <Card>
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <CardTitle class="text-2xl">
                {{ t('positions.details') }} - {{ positionId }}
              </CardTitle>
              <div class="flex items-center text-sm text-muted-foreground space-x-2">
                <span>•</span>
                <span>{{ position.positionType }}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
            <!-- Temel Bilgiler -->
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
              <Label>{{ t('positions.columns.reservationNo') }}</Label>
              <div class="font-medium">
                {{ position.reservationNo }}
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
            <div class="space-y-1">
              <Label>{{ t('positions.columns.openingDate') }}</Label>
              <div class="font-medium">
                {{ position.openingDate }}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Sekmeler -->
      <Tabs v-model="activeTab as string" class="space-y-4">
        <TabsList class="w-full justify-start">
          <TabsTrigger
            v-for="tab in tabs"
            :key="tab.id"
            :value="tab.id"
          >
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>

        <!-- Sefer Bilgileri Sekmesi -->
        <TabsContent value="trip-details">
          <TripDetails :position-id="position.positionNo" />
        </TabsContent>

        <!-- Yük ve Fatura Sekmesi -->
        <TabsContent value="cargo-invoice">
          <CargoInvoiceDetails :position-id="position.positionNo" />
        </TabsContent>

        <!-- Parsiyel Yükler Sekmesi -->
        <TabsContent value="partial-loads">
          <PartialLoadsDetails />
        </TabsContent>
      </Tabs>
    </template>
  </div>
</template>
