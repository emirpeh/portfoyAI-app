<script lang="ts" setup>
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
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

const props = defineProps<{ supplierId: number }>()
const { fetchSupplier, updateSupplier } = useSuppliers()

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
  customs: '',
  foreignTrades: '',
  language: 'tr',
})

onMounted(async () => {
  try {
    const data: any = await fetchSupplier(props.supplierId)
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
    locale: tr,
  })
}

function formatCountries(countries: string | string[]) {
  if (!countries) return ''
  const countriesArray = Array.isArray(countries) ? countries : countries.split(',')
  return countriesArray.map(country => country.trim()).join(', ')
}

function formatCustoms(customs: string | string[]) {
  if (!customs) return ''
  const customsArray = Array.isArray(customs) ? customs : customs.split(',')
  return customsArray.map(custom => custom.trim()).join(', ')
}

function formatForeignTrades(trades: string | string[]) {
  if (!trades) return ''
  const tradeMap: { [key: string]: string } = {
    IM: 'İthalat',
    EX: 'İhracat',
    TRN: 'Transit',
  }
  const tradesArray = Array.isArray(trades) ? trades : trades.split(',')
  return tradesArray.map((trade) => {
    const code = trade.trim()
    return tradeMap[code] || code
  }).join(', ')
}

async function handleSubmit() {
  try {
    if (!supplier.value?.id) return
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
        Yükleniyor...
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
          Düzenle
        </Button>
      </div>

      <Card class="border-none shadow-lg">
        <CardContent class="p-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-4">
              <h2 class="mb-2 text-lg text-primary font-semibold">
                Kişisel Bilgiler
              </h2>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-user" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Tam Adı
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
                    E-posta
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
                    Cinsiyet
                  </h3>
                  <p class="text-sm font-medium">
                    {{ supplier.gender === 'MALE' ? 'Erkek' : 'Kadın' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h2 class="mb-2 text-lg text-primary font-semibold">
                Şirket Bilgileri
              </h2>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-building-office" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Şirket Adı
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
                    Ülkeler
                  </h3>
                  <p class="text-sm font-medium">
                    {{ formatCountries(supplier.countries) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-globe-americas" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Gümrükler
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
                    Dış Ticaret
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
                    Dil
                  </h3>
                  <p class="text-sm font-medium">
                    {{ supplier.language }}
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
          <DialogTitle>Tedarikçi Düzenle</DialogTitle>
          <DialogDescription>
            Tedarikçi bilgilerini güncelleyin.
          </DialogDescription>
        </DialogHeader>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="name">Tam Adı</Label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="Adı"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="email">E-posta</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="E-posta"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="gender">Cinsiyet</Label>
            <select
              id="gender"
              v-model="form.gender"
              class="w-full border rounded p-2"
              required
            >
              <option value="MALE">
                Erkek
              </option>
              <option value="FEMALE">
                Kadın
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="companyName">Şirket Adı</Label>
            <Input
              id="companyName"
              v-model="form.companyName"
              placeholder="Şirket Adı"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="countries">Ülkeler</Label>
            <Input
              id="countries"
              v-model="form.countries"
              placeholder="Ülkeler (virgülle ayırarak)"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="customs">Gümrükler</Label>
            <Input
              id="customs"
              v-model="form.customs"
              placeholder="Gümrükler (virgülle ayırarak)"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="foreignTrades">Dış Ticaret</Label>
            <Input
              id="foreignTrades"
              v-model="form.foreignTrades"
              placeholder="Dış Ticaret (virgülle ayırarak)"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="language">Dil</Label>
            <Input
              id="language"
              v-model="form.language"
              placeholder="Dil"
              required
            />
          </div>
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="showEditModal = false">
              İptal
            </Button>
            <Button type="submit">
              Kaydet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
