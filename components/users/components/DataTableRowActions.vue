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
import { useI18n } from 'vue-i18n'
import { useUsers } from '~/composables/useUsers'
import { userSchema } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<User>
}

const props = defineProps<DataTableRowActionsProps>()
const emit = defineEmits(['edit'])

const { t } = useI18n()
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
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleEdit">
        {{ t('users.edit') }}
        <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem :disabled="user.isDefault" @click="showDeleteDialog = true">
        {{ t('users.delete') }}
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ t('users.deleteConfirmTitle') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ t(`users.deleteConfirm${user.role}`) }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ t('common.cancel') }}</AlertDialogCancel>
        <AlertDialogAction variant="destructive" @click="handleDelete">
          {{ t('common.delete') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
