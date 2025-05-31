<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Customer } from '../data/schema'
import { useNuxtApp } from '#app'
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
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCustomers } from '@/composables/useCustomers'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AddOrEditUser from '~/components/users/components/AddOrEditUser.vue'
import { useUsers } from '~/composables/useUsers'
import { customerSchema } from '../data/schema'

interface Contact {
  companyNo: string
  name: string
  phone: string
  email: string
  isSend: boolean
}

const props = defineProps<DataTableRowActionsProps>()

const { t } = useI18n()
const { deleteUser } = useUsers()
const { getCustomerMailList } = useCustomers()
const { $apiFetch } = useNuxtApp()

interface DataTableRowActionsProps {
  row: Row<Customer>
}

const showAddAccount = ref(false)
const showDeleteDialog = ref(false)
const showContactDialog = ref(false)
const contacts = ref<Contact[]>([])
const loading = ref(false)

const customer = computed(() => customerSchema.parse(props.row.original))

function handleClick() {
  showAddAccount.value = !showAddAccount.value
}

async function handleDelete() {
  if (!customer.value.id) {
    return
  }

  try {
    await deleteUser(customer.value.accountId!)
    showDeleteDialog.value = false
  }
  catch (error) {
    console.error('Error deleting customer:', error)
  }
}

async function handleContactClick() {
  showContactDialog.value = true
  loading.value = true
  try {
    contacts.value = (await getCustomerMailList(props.row.original.id)) as Contact[]
  }
  catch (error) {
    console.error('Error fetching contacts:', error)
  }
  finally {
    loading.value = false
  }
}

async function handleMailStatusChange(contact: Contact) {
  try {
    await $apiFetch(`/customers/${props.row.original.id}/mail`, {
      method: 'PUT',
      body: {
        mail: contact.email,
        isSend: !contact.isSend,
      },
    })
    // Refresh the contacts list after update
    contacts.value = (await getCustomerMailList(props.row.original.id)) as Contact[]
  }
  catch (error) {
    console.error('Error updating mail status:', error)
  }
}
</script>

<template>
  <Dialog v-model:open="showAddAccount">
    <DialogContent class="sm:max-w-[425px]">
      <AddOrEditUser
        :show="showAddAccount"
        role="CUSTOMER"
        :external-id="row.original.id"
        :user-id="row?.original?.accountId"
        @update:show="showAddAccount = $event"
      />
    </DialogContent>
  </Dialog>

  <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ t('customers.deleteConfirmTitle') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ t('customers.deleteConfirmDescription') }}
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
      <DropdownMenuItem @click="handleClick">
        {{ row.original.accountId ? t('customers.updateAccount') : t('customers.createAccount') }}
      </DropdownMenuItem>
      <DropdownMenuItem :disabled="!row.original.accountId" @click="showDeleteDialog = true">
        {{ t('customers.deleteAccount') }}
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleContactClick">
        {{ t('customers.actions.contact') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog :open="showContactDialog" @update:open="showContactDialog = $event">
    <DialogContent class="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>{{ t('customers.contacts.title') }}</DialogTitle>
      </DialogHeader>
      <div v-if="loading" class="flex items-center justify-center py-4">
        <div class="h-8 w-8 animate-spin border-b-2 border-primary rounded-full" />
      </div>
      <div v-else class="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader class="sticky top-0 bg-background">
            <TableRow>
              <TableHead class="w-[200px]">
                {{ t('customers.contacts.name') }}
              </TableHead>
              <TableHead class="w-[200px]">
                {{ t('customers.contacts.phone') }}
              </TableHead>
              <TableHead class="w-[300px]">
                {{ t('customers.contacts.email') }}
              </TableHead>
              <TableHead class="w-[100px]">
                {{ t('customers.contacts.status') }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="contact in contacts" :key="contact.companyNo">
              <TableCell class="truncate">
                {{ contact.name }}
              </TableCell>
              <TableCell class="truncate">
                {{ contact.phone }}
              </TableCell>
              <TableCell class="truncate">
                {{ contact.email }}
              </TableCell>
              <TableCell class="text-center">
                <Checkbox
                  :checked="contact.isSend"
                  class="cursor-pointer"
                  @update:checked="handleMailStatusChange(contact)"
                />
              </TableCell>
            </TableRow>
            <TableRow v-if="contacts.length === 0">
              <TableCell colspan="3" class="text-center">
                {{ t('customers.contacts.noData') }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  </Dialog>
</template>
