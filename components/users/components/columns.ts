import type { ColumnDef } from '@tanstack/vue-table'
import type { User } from '../data/schema'
import { h } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

type Column = ColumnDef<User, unknown>

export const columns: Column[] = [
  {
    id: 'id',
    accessorFn: row => row.id,
    header: ({ column }) => h(DataTableColumnHeader, {
      column,
      title: 'users.columns.id',
    }),
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
    meta: {
      hidden: true,
    },
  },
  {
    id: 'email',
    accessorFn: row => row.email,
    header: ({ column }) => h(DataTableColumnHeader, {
      column,
      title: 'users.columns.email',
    }),
  },
  {
    id: 'role',
    accessorFn: row => row.role,
    header: ({ column }) => h(DataTableColumnHeader, {
      column,
      title: 'users.columns.role',
    }),
    cell: ({ row }) => {
      const { t } = useI18n()
      const role = row.getValue('role')
      return h('div', {}, t(role === 'ADMIN' ? 'users.roles.admin' : 'users.roles.user'))
    },
  },
  {
    id: 'createdAt',
    accessorFn: row => row.createdAt,
    header: ({ column }) => h(DataTableColumnHeader, {
      column,
      title: 'users.columns.createdAt',
    }),
    cell: ({ row }) => h('div', {}, new Date(row.getValue('createdAt')).toLocaleDateString()),
  },
  {
    id: 'updatedAt',
    accessorFn: row => row.updatedAt,
    header: ({ column }) => h(DataTableColumnHeader, {
      column,
      title: 'users.columns.updatedAt',
    }),
    cell: ({ row }) => h('div', {}, new Date(row.getValue('updatedAt')).toLocaleDateString()),
  },
  {
    accessorKey: 'isDefault',
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: 'users.columns.isDefault',
      })
    },
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
    meta: {
      hidden: true,
    },
    cell: ({ row }) => {
      return h('div', {}, row.getValue('isDefault') ? 'Yes' : 'No')
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
