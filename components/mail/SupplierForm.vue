<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  supplier?: Supplier
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): void
  (e: 'cancel'): void
  (e: 'update:open', value: boolean): void
}>()

const { t } = useI18n()

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
        <DialogTitle>{{ supplier ? t('email.suppliers.edit') : t('email.suppliers.add') }}</DialogTitle>
      </DialogHeader>
      <div class="overflow-y-auto pr-6" style="max-height: calc(90vh - 180px);">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="name">{{ t('email.suppliers.form.name') }}</Label>
            <Input
              id="name"
              v-model="form.name"
              :placeholder="t('email.suppliers.form.placeholder.name')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="email">{{ t('email.suppliers.form.email') }}</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              :placeholder="t('email.suppliers.form.placeholder.email')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="gender">{{ t('email.suppliers.form.gender') }}</Label>
            <select
              id="gender"
              v-model="form.gender"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
            >
              <option value="">
                {{ t('email.suppliers.form.placeholder.gender') }}
              </option>
              <option value="MALE">
                {{ t('email.suppliers.form.genderOptions.male') }}
              </option>
              <option value="FEMALE">
                {{ t('email.suppliers.form.genderOptions.female') }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="companyName">{{ t('email.suppliers.form.companyName') }}</Label>
            <Input
              id="companyName"
              v-model="form.companyName"
              :placeholder="t('email.suppliers.form.placeholder.companyName')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="countries">{{ t('email.suppliers.form.countries') }}</Label>
            <Input
              id="countries"
              v-model="form.countries"
              :placeholder="t('email.suppliers.form.placeholder.countries')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="customs">{{ t('email.suppliers.form.customs') }}</Label>
            <Input
              id="customs"
              v-model="form.customs"
              :placeholder="t('email.suppliers.form.placeholder.customs')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="foreignTrades">{{ t('email.suppliers.form.foreignTrades') }}</Label>
            <select
              id="foreignTrades"
              v-model="form.foreignTrades"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
              multiple
            >
              <option value="IM">
                {{ t('email.suppliers.form.foreignTradesOptions.IM') }}
              </option>
              <option value="EX">
                {{ t('email.suppliers.form.foreignTradesOptions.EX') }}
              </option>
              <option value="TRN">
                {{ t('email.suppliers.form.foreignTradesOptions.TRN') }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="language">{{ t('email.suppliers.form.language') }}</Label>
            <select
              id="language"
              v-model="form.language"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
            >
              <option value="">
                {{ t('email.suppliers.placeholder.language') }}
              </option>
              <option value="tr">
                {{ t('email.suppliers.languageOptions.tr') }}
              </option>
              <option value="en">
                {{ t('email.suppliers.languageOptions.en') }}
              </option>
              <option value="hr">
                {{ t('email.suppliers.languageOptions.hr') }}
              </option>
              <option value="sl">
                {{ t('email.suppliers.languageOptions.sl') }}
              </option>
              <option value="bs">
                {{ t('email.suppliers.languageOptions.bs') }}
              </option>
              <option value="mk">
                {{ t('email.suppliers.languageOptions.mk') }}
              </option>
            </select>
          </div>
        </form>
      </div>
      <div class="mt-4 flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" @click="handleCancel">
          {{ t('email.suppliers.form.buttons.cancel') }}
        </Button>
        <Button type="submit" @click="handleSubmit">
          {{ supplier ? t('email.suppliers.form.buttons.update') : t('email.suppliers.form.buttons.add') }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
