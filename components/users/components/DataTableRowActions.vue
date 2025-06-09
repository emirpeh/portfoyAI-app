<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { User } from '../data/schema'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#components'
import { computed } from 'vue'
import { useUsers } from '~/composables/useUsers'
import { userSchema } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<User>
}

const props = defineProps<DataTableRowActionsProps>()
const emit = defineEmits(['edit'])

const { deleteUser } = useUsers()

const user = computed(() => userSchema.parse(props.row.original))
const showDeleteDialog = ref(false)

function handleEdit() {
  if (user.value.id) {
    emit('edit', user.value.id)
  }
}

async function handleDelete() {
  if (!user.value.id) {
    return
  }

  try {
    await deleteUser(user.value.id)
    showDeleteDialog.value = false
  }
  catch (error) {
    console.error('Error deleting user:', error)
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="h-8 w-8 flex p-0 data-[state=open]:bg-muted"
      >
        <Icon name="i-radix-icons-dots-horizontal" class="h-4 w-4" />
        <span class="sr-only">Menüyü aç</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleEdit">
        Düzenle
        <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem :disabled="user.isDefault" @click="showDeleteDialog = true">
        Sil
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
        <AlertDialogDescription>
          {{ user.role === 'ADMIN'
            ? 'Bu işlem geri alınamaz. Bu, yönetici hesabını kalıcı olarak silecek ve verilerini sunucularımızdan kaldıracaktır.'
            : 'Bu işlem geri alınamaz. Bu, kullanıcı hesabını kalıcı olarak silecek ve verilerini sunucularımızdan kaldıracaktır.' }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>İptal</AlertDialogCancel>
        <AlertDialogAction variant="destructive" @click="handleDelete">
          Sil
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
