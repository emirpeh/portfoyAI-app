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

interface Props {
  show: boolean
  role: 'CUSTOMER' | 'ADMIN'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const { t } = useI18n()

const formData = ref({
  email: '',
  password: '',
})

function onSubmit() {
  emit('update:show', false)
}
</script>

<template>
  <Dialog
    :open="show"
    @update:open="emit('update:show', $event)"
  >
    <DialogContent class="bg-background sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ t('users.createAccount') }}</DialogTitle>
        <DialogDescription>
          {{ t('users.createAccountDescription') }}
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="onSubmit">
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="email" class="text-right">
              {{ t('users.email') }}
            </Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              class="col-span-3"
              required
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="password" class="text-right">
              {{ t('users.password') }}
            </Label>
            <Input
              id="password"
              v-model="formData.password"
              type="password"
              class="col-span-3"
              required
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label class="text-right">
              {{ t('users.role') }}
            </Label>
            <div class="col-span-3 font-medium">
              {{ t(`users.roles.${props.role.toLowerCase()}`) }}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            {{ t('users.save') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
:deep(.dialog-overlay) {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
