<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSuppliers } from '@/composables/useSuppliers'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ supplierId: number }>()
const { locale } = useI18n()
const { fetchSupplier, updateSupplier } = useSuppliers()
const { t } = useI18n()

const supplier = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const showEditModal = ref(false)
const form = ref({
  name: '',
  email: '',
  gender: 'MALE' as 'MALE' | 'FEMALE',
  companyName: '',
  countries: '',
  foreignTrades: '',
  language: 'tr',
})

onMounted(async () => {
  try {
    const data = await fetchSupplier(props.supplierId)
    supplier.value = data
    form.value = {
      name: data.name,
      email: data.email,
      gender: data.gender,
      companyName: data.companyName,
      countries: data.countries,
      customs: data.customs,
      foreignTrades: data.foreignTrades,
      language: data.language,
    }
  }
  catch {
    error.value = 'Tedarikçi bilgileri yüklenirken bir hata oluştu.'
  }
  finally {
    loading.value = false
  }
})

function formatDate(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: locale.value === 'tr' ? tr : undefined,
  })
}

function formatCountries(countries: string | string[]) {
  const countriesArray = Array.isArray(countries) ? countries : countries.split(',')
  return countriesArray.map(country => country.trim()).join(', ')
}

function formatCustoms(customs: string | string[]) {
  const customsArray = Array.isArray(customs) ? customs : customs.split(',')
  return customsArray.map(custom => custom.trim()).join(', ')
}

function formatForeignTrades(trades: string | string[]) {
  const tradesArray = Array.isArray(trades) ? trades : trades.split(',')
  return tradesArray.map((trade) => {
    const code = trade.trim()
    return t(`email.suppliers.form.foreignTradesOptions.${code}`)
  }).join(', ')
}

async function handleSubmit() {
  try {
    await updateSupplier(supplier.value.id, form.value)
    const data = await fetchSupplier(props.supplierId)
    supplier.value = data
    showEditModal.value = false
  }
  catch (error) {
    console.error('Error updating supplier:', error)
  }
}
</script>

<template>
  <div class="mx-auto p-4 container">
    <div v-if="loading" class="h-64 flex items-center justify-center">
      <p class="text-gray-500">
        {{ t('email.supplier_display.loading') }}
      </p>
    </div>

    <div v-else-if="error" class="h-64 flex items-center justify-center">
      <p class="text-red-500">
        {{ error }}
      </p>
    </div>

    <div v-else-if="supplier" class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between rounded-lg from-primary/10 to-primary/5 bg-gradient-to-r p-4">
        <div>
          <h1 class="text-2xl text-primary font-bold">
            {{ supplier.name }}
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ formatDate(new Date(supplier.createdAt)) }}
          </p>
        </div>
        <Button @click="showEditModal = true">
          {{ t('email.supplier_display.edit') }}
        </Button>
      </div>

      <Card class="border-none shadow-lg">
        <CardContent class="p-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-4">
              <h2 class="mb-2 text-lg text-primary font-semibold">
                {{ t('email.supplier_display.personal_info') }}
              </h2>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-user" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    {{ t('email.supplier_display.full_name') }}
                  </h3>
                  <p class="text-sm font-medium">
                    {{ supplier.name }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-envelope" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    {{ t('email.supplier_display.email') }}
                  </h3>
                  <a :href="`mailto:${supplier.email}`" class="text-sm text-primary font-medium hover:underline">
                    {{ supplier.email }}
                  </a>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-user" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    {{ t('email.supplier_display.gender') }}
                  </h3>
                  <p class="text-sm font-medium">
                    {{ supplier.gender === 'MALE' ? t('email.supplier_display.form.male') : t('email.supplier_display.form.female') }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h2 class="mb-2 text-lg text-primary font-semibold">
                {{ t('email.supplier_display.company_info') }}
              </h2>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-building-office" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    {{ t('email.supplier_display.company_name') }}
                  </h3>
                  <p class="text-sm font-medium">
                    {{ supplier.companyName }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-globe-americas" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    {{ t('email.supplier_display.countries') }}
                  </h3>
                  <p class="text-sm font-medium">
                    {{ formatCountries(supplier.countries) }}
                  </p>
                </div>
              </div>
              <div  class="flex items-center gap-2">
                <Icon name="i-heroicons-globe-americas" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    {{ t('email.supplier_display.customs') }}
                  </h3>
                  <p class="text-sm font-medium">
                    {{ formatCustoms(supplier.customs) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-globe-americas" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    {{ t('email.supplier_display.foreign_trade') }}
                  </h3>
                  <p class="text-sm font-medium">
                    {{ formatForeignTrades(supplier.foreignTrades) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-globe-americas" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    {{ t('email.supplier_display.language') }}
                  </h3>
                  <p class="text-sm font-medium">
                    {{ t(`language.${supplier.language}`) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Edit Modal -->
    <Dialog v-model:open="showEditModal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t('email.supplier_display.edit_supplier') }}</DialogTitle>
          <DialogDescription>
            {{ t('email.supplier_display.edit_supplier_description') }}
          </DialogDescription>
        </DialogHeader>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="name">{{ t('email.supplier_display.form.full_name') }}</Label>
            <Input
              id="name"
              v-model="form.name"
              :placeholder="t('email.supplier_display.form.full_name_placeholder')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="email">{{ t('email.supplier_display.form.email') }}</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              :placeholder="t('email.supplier_display.form.email_placeholder')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="gender">{{ t('email.supplier_display.form.gender') }}</Label>
            <select
              id="gender"
              v-model="form.gender"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
            >
              <option value="MALE">
                {{ t('email.supplier_display.form.male') }}
              </option>
              <option value="FEMALE">
                {{ t('email.supplier_display.form.female') }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="companyName">{{ t('email.supplier_display.form.company_name') }}</Label>
            <Input
              id="companyName"
              v-model="form.companyName"
              :placeholder="t('email.supplier_display.form.company_name_placeholder')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="countries">{{ t('email.supplier_display.form.countries') }}</Label>
            <Input
              id="countries"
              v-model="form.countries"
              :placeholder="t('email.supplier_display.form.countries_placeholder')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="customs">{{ t('email.supplier_display.form.customs') }}</Label>
            <Input
              id="customs"
              v-model="form.customs"
              :placeholder="t('email.supplier_display.form.customs_placeholder')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="foreignTrades">{{ t('email.supplier_display.form.foreign_trade') }}</Label>
            <select
              id="foreignTrades"
              v-model="form.foreignTrades"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
              multiple
            >
              <option value="IM">
                {{ t('email.supplier_display.form.import') }}
              </option>
              <option value="EX">
                {{ t('email.supplier_display.form.export') }}
              </option>
              <option value="TRN">
                {{ t('email.supplier_display.form.transit') }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="language">{{ t('email.supplier_display.form.language') }}</Label>
            <select
              id="language"
              v-model="form.language"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
            >
              <option value="tr">
                {{ t('language.turkish') }}
              </option>
              <option value="en">
                {{ t('language.english') }}
              </option>
              <option value="hr">
                {{ t('language.croatian') }}
              </option>
              <option value="sl">
                {{ t('language.slovenian') }}
              </option>
              <option value="bs">
                {{ t('language.bosnian') }}
              </option>
              <option value="mk">
                {{ t('language.macedonian') }}
              </option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="showEditModal = false">
              {{ t('email.supplier_display.form.cancel') }}
            </Button>
            <Button type="submit">
              {{ t('email.supplier_display.form.update') }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
