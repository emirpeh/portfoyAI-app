<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { usePositionLoadingUnloading } from '~/composables/usePositionLoadingUnloading'

const route = useRoute()
const { t } = useI18n()
const { loadingLocations, unloadingLocations, loading, error, fetchLoadingUnloadingData } = usePositionLoadingUnloading()

onMounted(() => {
  if (route.query.id) {
    fetchLoadingUnloadingData(route.query.id as string)
  }
})
</script>

<template>
  <div class="grid gap-6">
    <div v-if="loading" class="flex items-center justify-center py-10">
      <Spinner class="h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ t('common.error') }}
    </div>

    <template v-else>
      <Card class="border shadow-sm" style="background-color: #343a40; border-color: transparent">
        <CardHeader style="background-color: #343a40; border-bottom: 1px solid rgba(255, 255, 255, 0.1)">
          <CardTitle class="text-sm" style="color: white">
            {{ t('positions.loadingUnloading.loadingTitle') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto border rounded-lg shadow-sm" style="border-color: rgba(255, 255, 255, 0.1)">
            <table class="w-full divide-y" style="border-color: rgba(255, 255, 255, 0.1)">
              <thead style="background-color: rgba(255, 255, 255, 0.05)">
                <tr>
                  <TableHead class="px-3 py-2 text-xs font-semibold" style="color: white">
                    {{ t('positions.loadingUnloading.address') }}
                  </TableHead>
                  <TableHead class="px-3 py-2 text-xs font-semibold" style="color: white">
                    {{ t('positions.loadingUnloading.date') }}
                  </TableHead>
                  <TableHead class="px-3 py-2 text-xs font-semibold" style="color: white">
                    {{ t('positions.loadingUnloading.quantity') }}
                  </TableHead>
                  <TableHead class="px-3 py-2 text-xs font-semibold" style="color: white">
                    {{ t('positions.loadingUnloading.notes') }}
                  </TableHead>
                </tr>
              </thead>
              <tbody class="divide-y" style="border-color: rgba(255, 255, 255, 0.1)">
                <TableRow v-for="location in loadingLocations" :key="location.place" class="hover:bg-[rgba(255,255,255,0.05)]">
                  <TableCell class="px-3 py-2 text-xs" style="color: white">
                    {{ location.address }}
                  </TableCell>
                  <TableCell class="px-3 py-2 text-xs" style="color: white">
                    {{ location.date }}
                  </TableCell>
                  <TableCell class="px-3 py-2 text-xs" style="color: white">
                    {{ location.quantity }}
                  </TableCell>
                  <TableCell class="px-3 py-2 text-xs" style="color: white">
                    {{ location.notes }}
                  </TableCell>
                </TableRow>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Boşaltma Yerleri -->
      <Card class="border shadow-sm" style="background-color: #343a40; border-color: transparent">
        <CardHeader style="background-color: #343a40; border-bottom: 1px solid rgba(255, 255, 255, 0.1)">
          <CardTitle class="text-sm" style="color: white">
            {{ t('positions.loadingUnloading.unloadingTitle') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto border rounded-lg shadow-sm" style="border-color: rgba(255, 255, 255, 0.1)">
            <table class="w-full divide-y" style="border-color: rgba(255, 255, 255, 0.1)">
              <thead style="background-color: rgba(255, 255, 255, 0.05)">
                <tr>
                  <TableHead class="px-3 py-2 text-xs font-semibold" style="color: white">
                    {{ t('positions.loadingUnloading.address') }}
                  </TableHead>
                  <TableHead class="px-3 py-2 text-xs font-semibold" style="color: white">
                    {{ t('positions.loadingUnloading.date') }}
                  </TableHead>
                  <TableHead class="px-3 py-2 text-xs font-semibold" style="color: white">
                    {{ t('positions.loadingUnloading.quantity') }}
                  </TableHead>
                  <TableHead class="px-3 py-2 text-xs font-semibold" style="color: white">
                    {{ t('positions.loadingUnloading.notes') }}
                  </TableHead>
                </tr>
              </thead>
              <tbody class="divide-y" style="border-color: rgba(255, 255, 255, 0.1)">
                <TableRow v-for="location in unloadingLocations" :key="location.place" class="hover:bg-[rgba(255,255,255,0.05)]">
                  <TableCell class="px-3 py-2 text-xs" style="color: white">
                    {{ location.address }}
                  </TableCell>
                  <TableCell class="px-3 py-2 text-xs" style="color: white">
                    {{ location.date }}
                  </TableCell>
                  <TableCell class="px-3 py-2 text-xs" style="color: white">
                    {{ location.quantity }}
                  </TableCell>
                  <TableCell class="px-3 py-2 text-xs" style="color: white">
                    {{ location.notes }}
                  </TableCell>
                </TableRow>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
