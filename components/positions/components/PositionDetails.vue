<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  position: any
}>()

const { t } = useI18n()
</script>

<template>
  <div class="grid gap-6">
    <Card>
      <CardHeader>
        <CardTitle>{{ t('positions.tripDetails') }}</CardTitle>
      </CardHeader>
    </Card>
  </div>
</template>
