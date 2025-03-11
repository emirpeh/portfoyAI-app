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
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Spinner class="h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ t('common.error') }}
    </div>

    <template v-else>
      <Card>
        <CardHeader>
          <CardTitle>{{ t('positions.loadingUnloading.loadingTitle') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{{ t('positions.loadingUnloading.address') }}</TableHead>
                <TableHead>{{ t('positions.loadingUnloading.date') }}</TableHead>
                <TableHead>{{ t('positions.loadingUnloading.quantity') }}</TableHead>
                <TableHead>{{ t('positions.loadingUnloading.notes') }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="location in loadingLocations" :key="location.place">
                <TableCell>{{ location.address }}</TableCell>
                <TableCell>{{ location.date }}</TableCell>
                <TableCell>{{ location.quantity }}</TableCell>
                <TableCell>{{ location.notes }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Boşaltma Yerleri -->
      <Card>
        <CardHeader>
          <CardTitle>{{ t('positions.loadingUnloading.unloadingTitle') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{{ t('positions.loadingUnloading.address') }}</TableHead>
                <TableHead>{{ t('positions.loadingUnloading.date') }}</TableHead>
                <TableHead>{{ t('positions.loadingUnloading.quantity') }}</TableHead>
                <TableHead>{{ t('positions.loadingUnloading.notes') }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="location in unloadingLocations" :key="location.place">
                <TableCell>{{ location.address }}</TableCell>
                <TableCell>{{ location.date }}</TableCell>
                <TableCell>{{ location.quantity }}</TableCell>
                <TableCell>{{ location.notes }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
