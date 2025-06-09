import type { ColumnDef } from '@tanstack/vue-table'

import type { Customer } from '../data/schema'
import { h } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export const columns: ColumnDef<Customer, any>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'checked': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Hepsini seç',
      'class': 'translate-y-0.5',
    }),
    cell: ({ row }) => h(Checkbox, { 'checked': row.getIsSelected(), 'onUpdate:checked': value => row.toggleSelected(!!value), 'ariaLabel': 'Satırı seç', 'class': 'translate-y-0.5' }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'company',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Firma' }),
    cell: ({ row }) => h('div', { class: 'max-w-[500px] truncate' }, row.getValue('company')),
  },
  {
    accessorKey: 'taxOffice',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Vergi Dairesi' }),
    cell: ({ row }) => h('div', { class: 'w-[180px]' }, row.getValue('taxOffice')),
  },
  {
    accessorKey: 'taxValue',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Vergi Numarası' }),
    cell: ({ row }) => h('div', { class: 'w-[120px]' }, row.getValue('taxValue')),
  },
  {
    accessorKey: 'currency',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Para Birimi' }),
    cell: ({ row }) => h('div', { class: 'w-[80px]' }, row.getValue('currency')),
  },
  {
    accessorKey: 'country',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Ülke' }),
    cell: ({ row }) => h('div', { class: 'w-[120px]' }, row.getValue('country')),
  },
  {
    accessorKey: 'city',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Şehir' }),
    cell: ({ row }) => h('div', { class: 'w-[120px]' }, row.getValue('city')),
  },
  {
    accessorKey: 'district',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'İlçe' }),
    cell: ({ row }) => h('div', { class: 'w-[120px]' }, row.getValue('district')),
  },
  {
    accessorKey: 'accountId',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Hesap ID' }),
    cell: ({ row }) => h('div', {
      class: [
        'w-[120px]',
        row.getValue('accountId') ? 'bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded' : '',
      ],
    }, row.getValue('accountId')),
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
