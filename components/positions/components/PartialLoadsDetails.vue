<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useDateFormat } from '~/composables/useDateFormat'
import { usePositionPartialLoads } from '~/composables/usePositionPartialLoads'

const route = useRoute()
const { t } = useI18n()
const { partialLoads, loading, error, fetchPartialLoads } = usePositionPartialLoads()
const { formatRelativeDate } = useDateFormat()

onMounted(() => {
  if (route.query.id) {
    fetchPartialLoads(route.query.id as string)
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
      <!-- Parsiyel Yükler -->
      <Card>
        <CardHeader>
          <CardTitle>{{ t('positions.tabs.partialLoads') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{{ t('positions.partialLoads.customer') }}</TableHead>
                <TableHead>{{ t('positions.partialLoads.sender') }}</TableHead>
                <TableHead>{{ t('positions.partialLoads.receiver') }}</TableHead>
                <TableHead>{{ t('positions.partialLoads.packages') }}</TableHead>
                <TableHead>{{ t('positions.partialLoads.weight') }}</TableHead>
                <TableHead>{{ t('positions.partialLoads.volume') }}</TableHead>
                <TableHead>{{ t('positions.partialLoads.goodsType') }}</TableHead>
                <TableHead>{{ t('positions.partialLoads.freight') }}</TableHead>
                <TableHead>{{ t('positions.partialLoads.loadingDate') }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="load in partialLoads" :key="load.customer">
                <TableCell>{{ load.customer }}</TableCell>
                <TableCell>{{ load.sender }}</TableCell>
                <TableCell>{{ load.receiver }}</TableCell>
                <TableCell>{{ load.packages }}</TableCell>
                <TableCell>{{ load.weight }}</TableCell>
                <TableCell>{{ load.volume }}</TableCell>
                <TableCell>{{ load.goodsType }}</TableCell>
                <TableCell>{{ load.freight }}</TableCell>
                <TableCell>{{ formatRelativeDate(load.loadingDate) }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
