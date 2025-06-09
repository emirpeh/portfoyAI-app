<script lang="ts" setup>
/* ------------------------------------------------------------------ */
/* ---------------------------  IMPORTLAR  -------------------------- */
/* ------------------------------------------------------------------ */
import { Icon } from '#components'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
/* ---- TipTap ---- */
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { computed, nextTick, ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useConfiguration } from '@/composables/useConfiguration'
import { useMailLogs } from '@/composables/useMailLogs'

import { useMailTemplates } from '@/composables/useMailTemplates'
import { useOffers } from '@/composables/useOffers'

/* ------------------------------------------------------------------ */
/* ------------------------  REAKTİF VERİLER  ----------------------- */
/* ------------------------------------------------------------------ */
const props = defineProps<{ offerId: number }>()
const { fetchOffer, updateOfferStatus } = useOffers()
const { calculateFinalPrice } = useConfiguration()
const { sendMail } = useMailLogs()
const { getCalculatedPriceTemplate } = useMailTemplates()

const offer = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedSupplierOfferId = ref<number | null>(null)
const showSendOfferDialog = ref(false)
const previewOpen = ref(false)
const expandedMailGroups = ref<Set<string>>(new Set())

const sendOfferForm = ref({
  email: '',
  subject: '',
  content: '',
})

/* ------------------------------------------------------------------ */
/* ----------------------  SUPPLIER / STATUS vb.  ------------------- */
/* ------------------------------------------------------------------ */
interface SupplierOffer {
  id: number
  price: number | null
  supplierContact: {
    id: number
    name: string
    email: string
    companyName: string
    gender: string
  }
  note?: string
  calculatedLdm?: number
  calculatedVolume?: number
}

const offerStatuses = [
  'OFFER_CREATED',
  'OFFER_MISSING_INFORMATION',
  'NO_SUPPLIER_FOR_OFFER',
  'FEE_REQUEST_FOR_OFFER',
  'WAITING_COMPLETE_FOR_OFFER',
  'OFFER_COMPLETED',
  'OFFER_CANCELED',
]

/* ------------------------------------------------------------------ */
/* -----------------------------  WATCH  ---------------------------- */
/* ------------------------------------------------------------------ */
watch(
  () => props.offerId,
  async (id: number) => {
    if (!id)
      return
    loading.value = true
    try {
      offer.value = await fetchOffer(id)
      error.value = null
    }
    catch {
      error.value = 'Teklif bilgileri yüklenirken bir hata oluştu.'
    }
    finally {
      loading.value = false
    }
  },
  { immediate: true },
)

/* ------------------------------------------------------------------ */
/* ---------------------------  YARDIMCI  --------------------------- */
/* ------------------------------------------------------------------ */
function formatDate(date: string | undefined) {
  return date ? new Date(date).toLocaleString() : '-'
}

const customerLanguage = computed(() => {
  if (!offer.value?.mailLogs)
    return 'turkish'
  for (const group of offer.value.mailLogs) {
    const initial = group.logs.find(
      (m: { type: string, language?: string }) => m.type === 'CUSTOMER_NEW_OFFER_REQUEST',
    )
    if (initial?.language)
      return initial.language
  }
  return 'turkish'
})

/* ------------------------------------------------------------------ */
/* ---------------------  SUPPLIER SEÇİM AKIŞI  --------------------- */
/* ------------------------------------------------------------------ */
async function handleSupplierOfferSelect(id: number, supplierOffer: SupplierOffer) {
  selectedSupplierOfferId.value = id
  sendOfferForm.value.email = offer.value?.customer?.email || ''

  try {
    const calc: any = await calculateFinalPrice(String(supplierOffer.price))

    const template = await getCalculatedPriceTemplate({
      language: customerLanguage.value,
      offerNo: offer.value.offerNo,
      supplierContact: supplierOffer.supplierContact,
      details: {
        originalPrice: String(supplierOffer.price),
        calculatedPrice: calc.finalPrice,
        rate: calc.rate,
        profitMargin: calc.profitMargin,
      },
    })

    sendOfferForm.value.subject = template.title
    sendOfferForm.value.content = template.content
    showSendOfferDialog.value = true
  }
  catch (err) {
    console.error('Error fetching template:', err)
  }
}

function closeSendOfferDialog() {
  showSendOfferDialog.value = false
  selectedSupplierOfferId.value = null
}

/* ------------------------------------------------------------------ */
/* -------------------------  MAIL GÖNDER  -------------------------- */
/* ------------------------------------------------------------------ */
async function sendOfferToCustomer() {
  if (!selectedSupplierOfferId.value)
    return
  const supplierOffer = offer.value.SupplierOffer
    .find((s: any) => s.id === selectedSupplierOfferId.value)
  if (!supplierOffer)
    return

  await sendMail({
    to: sendOfferForm.value.email,
    subject: sendOfferForm.value.subject,
    content: sendOfferForm.value.content,
    cc: [],
    supplierContactId: supplierOffer.supplierContact.id,
    price: String(supplierOffer.price),
    note: supplierOffer.note || '',
    supplierOfferId: supplierOffer.id,
  })

  showSendOfferDialog.value = false
  selectedSupplierOfferId.value = null
  sendOfferForm.value = { email: '', subject: '', content: '' }
  // Refresh offer
  offer.value = await fetchOffer(props.offerId)
}

/* ------------------------------------------------------------------ */
/* ---------------------------  TipTap  ----------------------------- */
/* ------------------------------------------------------------------ */
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      bulletList: { keepMarks: true },
      orderedList: { keepMarks: true },
    }),
    Underline,
  ],
  content: sendOfferForm.value.content,
  onUpdate({ editor }) {
    sendOfferForm.value.content = editor.getHTML()
  },
})

/* Dialog açılınca editöre mevcut içeriği yükle */
watch(showSendOfferDialog, async (open: boolean) => {
  if (open) {
    await nextTick()
    editor.value?.commands.setContent(sendOfferForm.value.content || '')
  }
})

/* Aktif butona renk vermek için */
function active(name: string, attributes?: Record<string, any>) {
  return editor.value?.isActive(name, attributes)
    ? 'rounded bg-primary/10 p-1.5 text-primary'
    : 'rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700'
}

/* ------------------------------------------------------------------ */
/* ---------   KALAN COMPUTED / YARDIMCI (DEĞİŞMEDİ)   -------------- */
/* ------------------------------------------------------------------ */
const offerInfoItems = computed(() => [
  { label: 'Teklif No', value: offer.value?.offerNo },
  { label: 'Yükleme Tarihi', value: formatDate(offer.value?.loadDate) },
  { label: 'Yükleme Ülkesi', value: offer.value?.loadCountry },
  { label: 'Yükleme Şehri', value: offer.value?.loadCity },
  { label: 'Paketleme Tipi', value: offer.value?.packagingType },
  { label: 'Konteyner Sayısı', value: offer.value?.numOfContainers },
  { label: 'Konteyner Tipi', value: offer.value?.containerType },
  { label: 'Konteyner Boyutları', value: offer.value?.containerDimensions },
  { label: 'Mal Tipi', value: offer.value?.goodsType },
  { label: 'İstiflenebilir mi?',
    value: offer.value?.isStackable === 'true'
      ? 'Evet'
      : offer.value?.isStackable === 'false'
        ? 'Hayır'
        : '-' },
  { label: 'Gümrük', value: offer.value?.customs || '-' },
  { label: 'Teslim Ülkesi', value: offer.value?.deliveryCountry },
  { label: 'Teslim Şehri', value: offer.value?.deliveryCity },
  { label: 'Teslim Tarihi', value: formatDate(offer.value?.deliveryDate) },
  { label: 'Dış Ticaret', value: offer.value?.foreignTrade || '-' },
  { label: 'Hesaplanan LDM', value: offer.value?.calculatedLdm || '-' },
  { label: 'Hesaplanan Hacim', value: offer.value?.calculatedVolume || '-' },
])

const supplierOfferInfoItems = computed(() => {
  if (!offer.value?.SupplierOffer)
    return []
  return offer.value.SupplierOffer.map((supplierOffer: any) => ([
    { label: 'Tedarikçi', value: supplierOffer.supplierContact.name },
    { label: 'Şirket', value: supplierOffer.supplierContact.companyName },
    { label: 'Fiyat', value: supplierOffer.price ? `${supplierOffer.price} EUR` : 'Belirtilmemiş' },
    { label: 'Not', value: supplierOffer.note || '-' },
  ]))
})

const mailLogInfoItems = computed(() => {
  if (!offer.value?.mailLogs)
    return []
  return offer.value.mailLogs.map((group: any) => ({
    type: group.type,
    logs: group.logs.map((log: any) => ([
      { label: 'Kimden', value: log.from },
      { label: 'Kime', value: log.to },
      { label: 'Konu', value: log.contentTitle },
      { label: 'Tarih', value: formatDate(log.createdAt) },
    ])),
    isExpanded: expandedMailGroups.value.has(group.type),
  }))
})

function getBadgeVariantFromStatus(status: string) {
  switch (status) {
    case 'OFFER_CREATED': return 'default'
    case 'OFFER_MISSING_INFORMATION': return 'destructive'
    case 'OFFER_RECEIVED': return 'secondary'
    case 'NO_SUPPLIER_FOR_OFFER': return 'destructive'
    case 'SUPPLIER_WAITING_FOR_OFFER': return 'secondary'
    case 'WAITING_FEE_FOR_OFFER': return 'outline'
    case 'OFFER_COMPLETED': return 'secondary'
    case 'OFFER_CANCELED': return 'destructive'
    default: return 'secondary'
  }
}

function toggleMailGroup(type: string) {
  if (expandedMailGroups.value.has(type))
    expandedMailGroups.value.delete(type)
  else
    expandedMailGroups.value.add(type)
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Başlık ve Kapat Butonu -->
    <div class="flex items-center justify-between border-b p-4">
      <h2 class="text-xl font-semibold">
        Teklif Detayları
      </h2>
      <Button variant="ghost" size="icon" @click="$emit('close')">
        <Icon name="lucide:x" class="h-5 w-5" />
      </Button>
    </div>

    <!-- İçerik Alanı -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="loading" class="flex justify-center items-center h-full">
        Yükleniyor...
      </div>
      <div v-else-if="error" class="text-red-500">
        {{ error }}
      </div>

      <div v-else-if="offer" class="space-y-6">
        <!-- Teklif Bilgileri -->
        <Card>
          <CardHeader>
            <CardTitle>Genel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div v-for="item in offerInfoItems" :key="item.label">
                <p class="font-semibold">
                  {{ item.label }}
                </p>
                <p>{{ item.value }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Teklif Durumu -->
        <Card>
          <CardHeader>
            <CardTitle>Teklif Durumu</CardTitle>
          </CardHeader>
          <CardContent class="flex items-center gap-4">
            <Badge :variant="getBadgeVariantFromStatus(offer.status)">
              {{ offer.status }}
            </Badge>
            <Select @update:model-value="(status) => updateOfferStatus(offer.offerNo, status)">
              <SelectTrigger class="w-[250px]">
                <SelectValue placeholder="Durumu Değiştir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="status in offerStatuses" :key="status" :value="status">
                  {{ status }}
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <!-- Tedarikçi Teklifleri -->
        <Card>
          <CardHeader>
            <CardTitle>Tedarikçi Teklifleri</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              v-for="(supplierOffer, index) in supplierOfferInfoItems"
              :key="index"
              class="border rounded-lg p-4"
            >
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div v-for="item in supplierOffer" :key="item.label">
                  <p class="font-semibold">
                    {{ item.label }}
                  </p>
                  <p>{{ item.value }}</p>
                </div>
              </div>
              <Button class="mt-4" size="sm" @click="handleSupplierOfferSelect(offer.SupplierOffer[index].id, offer.SupplierOffer[index])">
                Müşteriye Gönder
              </Button>
            </div>
            <div v-if="!supplierOfferInfoItems.length">
              <p>Tedarikçilerden henüz bir teklif alınmadı.</p>
            </div>
          </CardContent>
        </Card>

        <!-- Mail Geçmişi -->
        <Card>
          <CardHeader>
            <CardTitle>Mail Geçmişi</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <div v-for="group in mailLogInfoItems" :key="group.type">
              <Button variant="ghost" class="w-full justify-start" @click="toggleMailGroup(group.type)">
                <Icon
                  name="lucide:chevron-right"
                  class="h-4 w-4 mr-2 transition-transform"
                  :class="{ 'rotate-90': group.isExpanded }"
                />
                {{ group.type }} ({{ group.logs.length }})
              </Button>
              <div v-if="group.isExpanded" class="pl-6 space-y-2 py-2">
                <div v-for="(log, logIndex) in group.logs" :key="logIndex" class="border-l-2 pl-4 py-1">
                  <div v-for="item in log" :key="item.label" class="text-sm">
                    <span class="font-semibold">{{ item.label }}:</span> {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Teklif Gönderme Dialog -->
    <Dialog v-model:open="showSendOfferDialog" @update:open="closeSendOfferDialog">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Müşteriye Teklif Gönder</DialogTitle>
          <DialogDescription>
            Tedarikçiden gelen teklifi müşteriye göndermek için aşağıdaki formu düzenleyin.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <label for="email" class="font-semibold">Alıcı E-posta</label>
            <Input id="email" v-model="sendOfferForm.email" />
          </div>
          <div>
            <label for="subject" class="font-semibold">Konu</label>
            <Input id="subject" v-model="sendOfferForm.subject" />
          </div>
          <div>
            <label class="font-semibold">İçerik</label>
            <div v-if="editor" class="mt-1 border rounded-md">
              <div
                class="flex flex-wrap items-center gap-2 border-b p-2"
              >
                <button type="button" :class="active('bold')" @click="editor.chain().focus().toggleBold().run()">
                  <Icon name="lucide:bold" />
                </button>
                <button type="button" :class="active('italic')" @click="editor.chain().focus().toggleItalic().run()">
                  <Icon name="lucide:italic" />
                </button>
                <button type="button" :class="active('underline')" @click="editor.chain().focus().toggleUnderline().run()">
                  <Icon name="lucide:underline" />
                </button>
                <button type="button" :class="active('strike')" @click="editor.chain().focus().toggleStrike().run()">
                  <Icon name="lucide:strikethrough" />
                </button>
                <button type="button" :class="active('heading', { level: 2 })" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
                  <Icon name="lucide:heading-2" />
                </button>
                <button type="button" :class="active('bulletList')" @click="editor.chain().focus().toggleBulletList().run()">
                  <Icon name="lucide:list" />
                </button>
                <button type="button" :class="active('orderedList')" @click="editor.chain().focus().toggleOrderedList().run()">
                  <Icon name="lucide:list-ordered" />
                </button>
              </div>
              <EditorContent :editor="editor" class="p-4 min-h-[200px]" />
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button variant="outline" @click="closeSendOfferDialog">
            İptal
          </Button>
          <Button @click="sendOfferToCustomer">
            Gönder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
