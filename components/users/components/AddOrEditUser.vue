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
import { useUsers } from '~/composables/useUsers'

interface Props {
  show: boolean
  role: 'CUSTOMER' | 'ADMIN'
  userId?: string
  externalId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const { t } = useI18n()
const { createUser, updateUser, getUser } = useUsers()

const formData = ref({
  email: '',
  password: '',
  role: props.role,
  externalId: props.externalId,
})

// Edit modu kontrolü
const isEditMode = computed(() => !!props.userId)

// Başlık ve açıklama metinleri
const dialogTitle = computed(() =>
  isEditMode.value ? t('users.editAccount') : t('users.createAccount'),
)
const dialogDescription = computed(() =>
  isEditMode.value ? t('users.editAccountDescription') : t('users.createAccountDescription'),
)

// Komponentin mount olduğunda mevcut kullanıcı verilerini yükle
onMounted(async () => {
  if (isEditMode.value && props.userId) {
    try {
      const userData = await getUser(props.userId)
      formData.value = {
        email: userData.email,
        password: '',
        role: props.role,
        externalId: props.externalId,
      }
    }
    catch (error) {
      console.error('Error fetching user:', error)
    }
  }
})

async function onSubmit() {
  try {
    if (isEditMode.value) {
      await updateUser(props.userId!, {
        email: formData.value.email,
        ...(formData.value.password && { password: formData.value.password }),
      })
    }
    else {
      await createUser({
        email: formData.value.email,
        password: formData.value.password,
        role: formData.value.role,
        ...(formData.value.externalId && { externalId: formData.value.externalId }),
      })
    }
    emit('update:show', false)
  }
  catch (error) {
    console.error('Error:', error)
  }
}
</script>

<template>
  <Dialog
    :open="show"
    @update:open="emit('update:show', $event)"
  >
    <DialogContent class="bg-background sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>
          {{ dialogDescription }}
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
              v-model="formData.email as string"
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
              v-model="formData.password as string"
              type="password"
              class="col-span-3"
              :required="!isEditMode"
              :placeholder="isEditMode ? t('users.passwordPlaceholder') : ''"
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
            {{ isEditMode ? t('users.update') : t('users.save') }}
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
