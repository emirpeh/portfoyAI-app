<script setup lang="ts">
import type { DateRange } from 'radix-vue'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  modelValue: { start: Date, end: Date } | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [{ start: Date, end: Date } | null]
}>()

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const value = computed<DateRange>({
  get() {
    if (!props.modelValue) {
      return {
        start: undefined,
        end: undefined,
      }
    }

    return {
      start: new CalendarDate(
        props.modelValue.start.getFullYear(),
        props.modelValue.start.getMonth(),
        props.modelValue.start.getDate(),
      ),
      end: new CalendarDate(
        props.modelValue.end.getFullYear(),
        props.modelValue.end.getMonth(),
        props.modelValue.end.getDate(),
      ),
    }
  },
  set(newValue: DateRange) {
    if (!newValue?.start || !newValue?.end) {
      emit('update:modelValue', null)
      return
    }

    emit('update:modelValue', {
      start: newValue.start.toDate(getLocalTimeZone()),
      end: newValue.end.toDate(getLocalTimeZone()),
    })
  },
})
</script>

<template>
  <div :class="cn('grid gap-2', $attrs.class ?? '')">
    <Popover>
      <PopoverTrigger as-child>
        <Button
          id="date"
          variant="outline"
          :class="cn(
            'justify-start text-left font-normal',
            !value.start && 'text-muted-foreground',
          )"
          style="background-color: #f5c518; color: #343a40; border-color: #f5c518;"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />

          <template v-if="value.start">
            <template v-if="value.end">
              {{ df.format(value.start.toDate(getLocalTimeZone())) }} - {{ df.format(value.end.toDate(getLocalTimeZone())) }}
            </template>
            <template v-else>
              {{ df.format(value.start.toDate(getLocalTimeZone())) }}
            </template>
          </template>
          <template v-else>
            Tarih Aralığı Seçin
          </template>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="end">
        <RangeCalendar
          v-model="value"
          weekday-format="short"
          :number-of-months="2"
          initial-focus
          :placeholder="value.start"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
