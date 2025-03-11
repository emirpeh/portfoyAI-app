import type { ColumnDef } from '@tanstack/vue-table'
import type { Position } from '../data/schema'
import { useRouter } from '#app'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'

import { h } from 'vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'

export function createColumns(t: (key: string) => string): ColumnDef<Position>[] {
  const router = useRouter()

  return [
    {
      accessorKey: 'positionNo',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'positions.columns.positionNo' }),
      cell: ({ row }) => h('div', {
        class: 'max-w-[500px] truncate cursor-pointer hover:text-primary',
        onClick: () => router.push(`/positions/detail?id=${row.getValue('positionNo')}`),
      }, row.getValue('positionNo')),
    },
    {
      accessorKey: 'positionType',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'positions.columns.positionType' }),
      cell: ({ row }) => h('div', {
        class: 'w-[120px] cursor-pointer hover:text-primary',
        onClick: () => router.push(`/positions/detail?id=${row.getValue('positionNo')}`),
      }, t(`positions.positionType.${row.getValue('positionType')}`)),
    },
    {
      accessorKey: 'orderDate',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'positions.columns.orderDate' }),
      cell: ({ row }) => {
        const date = row.getValue('orderDate')
        return h('div', {
          class: 'w-[120px] cursor-pointer hover:text-primary',
          onClick: () => router.push(`/positions/detail?id=${row.getValue('positionNo')}`),
        }, date ? format(new Date(date as string), 'dd.MM.yyyy') : '')
      },
    },
    {
      accessorKey: 'sender',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'positions.columns.sender' }),
      cell: ({ row }) => h('div', {
        class: 'w-[120px] cursor-pointer hover:text-primary',
        onClick: () => router.push(`/positions/detail?id=${row.getValue('positionNo')}`),
      }, row.getValue('sender')),
    },
    {
      accessorKey: 'receiver',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'positions.columns.receiver' }),
      cell: ({ row }) => h('div', {
        class: 'w-[120px] cursor-pointer hover:text-primary',
        onClick: () => router.push(`/positions/detail?id=${row.getValue('positionNo')}`),
      }, row.getValue('receiver')),
    },
    {
      accessorKey: 'countryOfLoading',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'positions.columns.countryOfLoading' }),
      cell: ({ row }) => h('div', {
        class: 'w-[120px] cursor-pointer hover:text-primary',
        onClick: () => router.push(`/positions/detail?id=${row.getValue('positionNo')}`),
      }, row.getValue('countryOfLoading')),
    },
    {
      accessorKey: 'placeOfLoading',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'positions.columns.placeOfLoading' }),
      cell: ({ row }) => h('div', {
        class: 'w-[120px] cursor-pointer hover:text-primary',
        onClick: () => router.push(`/positions/detail?id=${row.getValue('positionNo')}`),
      }, row.getValue('placeOfLoading')),
    },
    {
      accessorKey: 'countryOfUnloading',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'positions.columns.countryOfUnloading' }),
      cell: ({ row }) => h('div', {
        class: 'w-[120px] cursor-pointer hover:text-primary',
        onClick: () => router.push(`/positions/detail?id=${row.getValue('positionNo')}`),
      }, row.getValue('countryOfUnloading')),
    },
    {
      accessorKey: 'placeOfUnloading',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'positions.columns.placeOfUnloading' }),
      cell: ({ row }) => h('div', {
        class: 'w-[120px] cursor-pointer hover:text-primary',
        onClick: () => router.push(`/positions/detail?id=${row.getValue('positionNo')}`),
      }, row.getValue('placeOfUnloading')),
    },
  ]
}
