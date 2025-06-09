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

interface Props {
  show: boolean
  role: 'CUSTOMER' | 'ADMIN'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

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
        <DialogTitle>Hesap Oluştur</DialogTitle>
        <DialogDescription>
          Yeni bir hesap oluşturun.
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="onSubmit">
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="email" class="text-right">
              E-posta
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
              Şifre
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
              Rol
            </Label>
            <div class="col-span-3 font-medium">
              {{ props.role === 'CUSTOMER' ? 'Müşteri' : 'Yönetici' }}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            Kaydet
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
