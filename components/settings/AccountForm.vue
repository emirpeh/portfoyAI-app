<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import { toTypedSchema } from '@vee-validate/zod'
import { toDate } from 'radix-vue/date'
import { h, ref } from 'vue'
import * as z from 'zod'
import { toast } from '~/components/ui/toast'

const dateValue = ref()
const placeholder = ref()

const df = new DateFormatter('tr-TR', {
  dateStyle: 'long',
})

const accountFormSchema = toTypedSchema(z.object({
  name: z
    .string({
      required_error: 'Bu alan zorunludur.',
    })
    .min(2, {
      message: 'İsim en az 2 karakter olmalıdır.',
    })
    .max(30, {
      message: 'İsim 30 karakterden uzun olmamalıdır.',
    }),
  dob: z.string().datetime().optional().refine(date => date !== undefined, 'Lütfen geçerli bir tarih seçin.'),
}))

async function onSubmit(values: any) {
  toast({
    title: 'Aşağıdaki değerleri gönderdiniz:',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Hesap
    </h3>
    <p class="text-sm text-muted-foreground">
      Hesap ayarlarınızı güncelleyin.
    </p>
  </div>
  <Separator />
  <Form v-slot="{ setFieldValue }" :validation-schema="accountFormSchema" class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Ad</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Adınızı girin" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          Bu, profilinizde görünecek olan adınızdır.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ field, value }" name="dob">
      <FormItem class="flex flex-col">
        <FormLabel>Doğum Tarihi</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                :class="'w-[240px] justify-start text-left font-normal ' + (!value ? 'text-muted-foreground' : '')"
              >
                <Icon name="i-radix-icons-calendar" class="mr-2 h-4 w-4 opacity-50" />
                <span>{{ value ? df.format(toDate(dateValue, getLocalTimeZone())) : "Bir tarih seçin" }}</span>
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="p-0">
            <Calendar
              v-model:placeholder="placeholder"
              v-model="dateValue"
              calendar-label="Doğum Tarihi"
              initial-focus
              :min-value="new CalendarDate(1900, 1, 1)"
              :max-value="today(getLocalTimeZone())"
              @update:model-value="(v: any) => {
                if (v) {
                  dateValue = v
                  setFieldValue('dob', toDate(v).toISOString())
                }
                else {
                  dateValue = undefined
                  setFieldValue('dob', undefined)
                }
              }"
            />
          </PopoverContent>
        </Popover>
        <FormDescription>
          Doğum tarihiniz diğer kullanıcılar tarafından görülmeyecektir.
        </FormDescription>
        <FormMessage />
      </FormItem>
      <input type="hidden" v-bind="field">
    </FormField>

    <div class="flex justify-start">
      <Button type="submit">
        Güncelle
      </Button>
    </div>
  </Form>
</template>
