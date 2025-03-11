<script setup lang="ts">
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '#components'
import { useI18n } from 'vue-i18n'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const { t } = useI18n()

const formData = ref({
  positionNo: '',
  positionType: '',
})

function onSubmit() {
  emit('update:show', false)
}
</script>

<template>
  <Dialog :open="show" @update:open="emit('update:show', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ t('positions.createPosition') }}</DialogTitle>
        <DialogDescription>
          {{ t('positions.createPositionDescription') }}
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="onSubmit">
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="positionNo" class="text-right">
              {{ t('positions.columns.positionNo') }}
            </Label>
            <Input
              id="positionNo"
              v-model="formData.positionNo"
              class="col-span-3"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="positionType" class="text-right">
              {{ t('positions.columns.positionType') }}
            </Label>
            <Input
              id="positionType"
              v-model="formData.positionType"
              class="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            {{ t('positions.save') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
