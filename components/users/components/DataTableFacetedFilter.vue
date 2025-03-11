<script setup lang="ts">
import type { Column } from '@tanstack/vue-table'
import type { Component } from 'vue'
import type { User } from '../data/schema'
import { cn } from '@/lib/utils'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<DataTableFacetedFilter>()

const { t } = useI18n()

interface DataTableFacetedFilter {
  column?: Column<User, any>
  title?: string
  options: {
    label: string
    value: string
    icon?: Component
  }[]
}

const facets = computed(() => props.column?.getFacetedUniqueValues())
const selectedValues = computed(() => new Set(props.column?.getFilterValue() as string[]))

function handleFilterSelection(optionValue: string) {
  const isSelected = selectedValues.value.has(optionValue)

  if (isSelected) {
    selectedValues.value.delete(optionValue)
  }
  else {
    selectedValues.value.add(optionValue)
  }

  const filterValues = Array.from(selectedValues.value)
  props.column?.setFilterValue(filterValues.length ? filterValues : undefined)
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm" class="h-8 border-dashed">
        <Icon name="i-radix-icons-plus-circled" class="mr-2 h-4 w-4" />
        {{ title }}
        <template v-if="selectedValues.size > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ selectedValues.size }}
          </Badge>
          <div class="hidden lg:flex space-x-1">
            <Badge
              v-if="selectedValues.size > 2"
              variant="secondary"
              class="rounded-sm px-1 font-normal"
            >
              {{ selectedValues.size }} selected
            </Badge>

            <template v-else>
              <Badge
                v-for="item in options.filter(option => selectedValues.has(option.value))"
                :key="item.value"
                variant="secondary"
                class="rounded-sm px-1 font-normal"
              >
                {{ t(item.label) }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-[200px] p-0" align="start">
      <Command
        :filter-function="(list: DataTableFacetedFilter['options'], term: any) => list.filter(i => i.label.toLowerCase()?.includes(term))"
      >
        <CommandInput :placeholder="title" />
        <CommandList>
          <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option"
              @select="handleFilterSelection(option.value)"
            >
              <div
                :class="cn(
                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                  selectedValues.has(option.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible',
                )"
              >
                <Icon name="i-radix-icons-check" :class="cn('h-4 w-4')" />
              </div>
              <component :is="option.icon" v-if="option.icon" class="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{{ t(option.label) }}</span>
              <span v-if="facets?.get(option.value)" class="ml-auto h-4 w-4 flex items-center justify-center text-xs font-mono">
                {{ facets.get(option.value) }}
              </span>
            </CommandItem>
          </CommandGroup>

          <template v-if="selectedValues.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value="clear-filters"
                class="justify-center text-center"
                @select="column?.setFilterValue(undefined)"
              >
                Filtreleri Temizle
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
