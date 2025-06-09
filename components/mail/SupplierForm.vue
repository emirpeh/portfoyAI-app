<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  supplier?: Supplier
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): void
  (e: 'cancel'): void
  (e: 'update:open', value: boolean): void
}>()

interface Supplier {
  id?: number
  name: string
  email: string
  gender: 'MALE' | 'FEMALE'
  companyName: string
  countries: string
  customs: string
  foreignTrades: string
  language: string
}

const form = ref<Supplier>({
  name: props.supplier?.name ?? '',
  email: props.supplier?.email ?? '',
  gender: props.supplier?.gender ?? 'MALE',
  companyName: props.supplier?.companyName ?? '',
  countries: props.supplier?.countries ?? '',
  customs: props.supplier?.customs ?? '',
  foreignTrades: props.supplier?.foreignTrades ?? '',
  language: props.supplier?.language ?? 'tr',
})

const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value),
})

function handleSubmit() {
  emit('submit', form.value)
  emit('update:open', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>{{ supplier ? 'Tedarikçi Düzenle' : 'Tedarikçi Ekle' }}</DialogTitle>
      </DialogHeader>
      <div class="overflow-y-auto pr-6" style="max-height: calc(90vh - 180px);">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="name">İsim</Label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="Tedarikçi adı"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="email">E-posta</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Tedarikçi e-postası"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="gender">Cinsiyet</Label>
            <select
              id="gender"
              v-model="form.gender"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
            >
              <option value="">
                Cinsiyet Seçin
              </option>
              <option value="MALE">
                Erkek
              </option>
              <option value="FEMALE">
                Kadın
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="companyName">Firma Adı</Label>
            <Input
              id="companyName"
              v-model="form.companyName"
              placeholder="Firma adı"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="countries">Ülkeler</Label>
            <Input
              id="countries"
              v-model="form.countries"
              placeholder="Virgülle ayırarak ülkeleri girin"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="customs">Gümrükler</Label>
            <Input
              id="customs"
              v-model="form.customs"
              placeholder="Virgülle ayırarak gümrükleri girin"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="foreignTrades">Dış Ticaret Türleri</Label>
            <select
              id="foreignTrades"
              v-model="form.foreignTrades"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
              multiple
            >
              <option value="IM">
                İthalat
              </option>
              <option value="EX">
                İhracat
              </option>
              <option value="TRN">
                Transit
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="language">Dil</Label>
            <select
              id="language"
              v-model="form.language"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
            >
              <option value="">
                Dil Seçin
              </option>
              <option value="tr">
                Türkçe
              </option>
              <option value="en">
                İngilizce
              </option>
              <option value="hr">
                Hırvatça
              </option>
              <option value="sl">
                Slovence
              </option>
              <option value="bs">
                Boşnakça
              </option>
              <option value="mk">
                Makedonca
              </option>
            </select>
          </div>
        </form>
      </div>
      <div class="mt-4 flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" @click="handleCancel">
          İptal
        </Button>
        <Button type="submit" @click="handleSubmit">
          {{ supplier ? 'Güncelle' : 'Ekle' }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
