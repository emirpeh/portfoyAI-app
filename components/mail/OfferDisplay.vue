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

import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
const { t } = useI18n()

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
      error.value = t('email.offer_display.error')
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
  sendOfferForm.value.email = supplierOffer.supplierContact.email || ''

  try {
    const calc = await calculateFinalPrice(String(supplierOffer.price))

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
function active(name: string) {
  return editor.value?.isActive(name)
    ? 'rounded bg-primary/10 p-1.5 text-primary'
    : 'rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700'
}

/* ------------------------------------------------------------------ */
/* ---------   KALAN COMPUTED / YARDIMCI (DEĞİŞMEDİ)   -------------- */
/* ------------------------------------------------------------------ */
const offerInfoItems = computed(() => [
  { label: t('email.offer_no'), value: offer.value?.offerNo },
  { label: t('email.load_date'), value: formatDate(offer.value?.loadDate) },
  { label: t('email.load_country'), value: offer.value?.loadCountry },
  { label: t('email.load_city'), value: offer.value?.loadCity },
  { label: t('email.packaging_type'), value: offer.value?.packagingType },
  { label: t('email.num_of_containers'), value: offer.value?.numOfContainers },
  { label: t('email.container_type'), value: offer.value?.containerType },
  { label: t('email.container_dimensions'), value: offer.value?.containerDimensions },
  { label: t('email.goods_type'), value: offer.value?.goodsType },
  { label: t('email.is_stackable'), value: offer.value?.isStackable === 'true'
    ? t('common.yes')
    : offer.value?.isStackable === 'false'
      ? t('common.no')
      : '-' },
  { label: t('email.customs'), value: offer.value?.customs || '-' },
  { label: t('email.delivery_country'), value: offer.value?.deliveryCountry },
  { label: t('email.delivery_city'), value: offer.value?.deliveryCity },
  { label: t('email.delivery_date'), value: formatDate(offer.value?.deliveryDate) },
  { label: t('email.foreign_trade'), value: offer.value?.foreignTrade ? t(`email.suppliers.form.foreignTradesOptions.${offer.value.foreignTrade}`) : '-' },
  { label: t('email.offer_display.supplier_details.calculatedLdm'), value: offer.value?.calculatedLdm || '-' },
  { label: t('email.offer_display.supplier_details.calculatedVolume'), value: offer.value?.calculatedVolume || '-' },
])

const filteredSupplierOffers = computed(() =>
  offer.value.SupplierOffer?.filter((s: SupplierOffer) => s.price !== null) || [],
)

const supplierMap = computed(() => {
  if (!offer.value?.SupplierOffer)
    return {}
  return offer.value.SupplierOffer.reduce((acc: Record<number, any>, curr: any) => {
    if (curr.supplierContact)
      acc[curr.supplierContactId] = curr.supplierContact
    return acc
  }, {})
})

/* Tedarikçileri email'e göre grupla */
const groupedSupplierOffers = computed(() => {
  if (!offer.value?.SupplierOffer)
    return []

  const groups = new Map<string, SupplierOffer[]>()

  filteredSupplierOffers.value.forEach((offer: SupplierOffer) => {
    const email = offer.supplierContact.email
    if (!groups.has(email)) {
      groups.set(email, [])
    }
    groups.get(email)?.push(offer)
  })

  return Array.from(groups.entries()).map(([email, offers]) => ({
    email,
    offers,
    companyNames: [...new Set(offers.map(o => o.supplierContact.companyName))],
    contactNames: [...new Set(offers.map(o => o.supplierContact.name))],
  }))
})

/* Mail-log aç/kapa */
function toggleMailGroup(address: string) {
  expandedMailGroups.value.has(address)
    ? expandedMailGroups.value.delete(address)
    : expandedMailGroups.value.add(address)
}

async function handleStatusChange(newStatus: string) {
  try {
    await updateOfferStatus(offer.value.offerNo, newStatus)
    offer.value.status = newStatus
  }
  catch (err) {
    console.error('Status update error:', err)
  }
}

/* Müşterinin gönderdiği tüm teklif taleplerini (CUSTOMER_NEW_OFFER_REQUEST) topla */
const customerRequests = computed(() => {
  if (!offer.value?.mailLogs)
    return []

  const list: Array<{
    address: string
    id: number
    createdAt: string
    contentTitle: string
    contentBody: string
  }> = []

  for (const group of offer.value.mailLogs) {
    group.logs
      .filter((m: { type: string }) => m.type === 'CUSTOMER_NEW_OFFER_REQUEST')
      .forEach((mail: any) => list.push({ address: group.address, ...mail }))
  }
  /* İsterseniz tarihe göre sıralayın: */
  return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
})

/* Müşteriye gönderilen teklifler */
const sentOffers = computed(() => {
  if (!offer.value?.OfferResult)
    return []
  return offer.value.OfferResult.map((result: any) => ({
    ...result,
    supplierContact: result.supplierContact || supplierMap.value?.[result.supplierContactId],
  }))
})
</script>

  <!-- ----------------------------------------------------------------- -->
  <!-- ----------------------------- TEMPLATE --------------------------- -->
  <!-- ----------------------------------------------------------------- -->
<template>
  <div class="h-full flex flex-col text-sm">
    <div class="mx-auto h-[calc(100vh-180px)] overflow-y-auto p-2 container space-y-4">
      <!-- ------------------------------------------------------------ -->
      <!-- LOADING / ERROR / CONTENT -->
      <!-- ------------------------------------------------------------ -->
      <div v-if="loading" class="h-40 flex items-center justify-center">
        <p class="text-sm text-gray-500">
          {{ t('email.offer_display.loading') }}
        </p>
      </div>

      <div v-else-if="error" class="h-40 flex items-center justify-center">
        <p class="text-sm text-red-500">
          {{ error }}
        </p>
      </div>

      <div v-else-if="offer" class="space-y-4">
        <!-- ---------------------------------------------------------- -->
        <!-- HEADER -->
        <!-- ---------------------------------------------------------- -->
        <Card class="border-none shadow-lg">
          <CardContent class="flex items-center justify-between p-4">
            <div>
              <h1 class="text-base text-primary font-bold">
                {{ t('email.offer_display.offer_no') }}: {{ offer.offerNo }}
              </h1>
              <p class="text-xs text-muted-foreground">
                {{ t('email.offer_display.created_at') }}: {{ formatDate(offer.createdAt) }}
              </p>
            </div>

            <Select :model-value="offer.status" @update:model-value="handleStatusChange">
              <SelectTrigger class="w-[180px]">
                <SelectValue>
                  <span class="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-semibold">
                    {{ t(`email.status.${offer.status}`) }}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="status in offerStatuses"
                  :key="status"
                  :value="status"
                >
                  {{ t(`email.status.${status}`) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <!-- ---------------------------------------------------------- -->
        <!-- TEKLİF BİLGİLERİ -->
        <!-- ---------------------------------------------------------- -->
        <Card>
          <CardContent class="p-4">
            <h2 class="mb-3 text-sm text-primary font-semibold">
              {{ t('email.offer_display.offer_info') }}
            </h2>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div
                v-for="item in offerInfoItems"
                :key="item.label"
                class="flex items-center border border-gray-100 rounded bg-gray-50 px-3 py-2 shadow-sm"
              >
                <span class="w-1/2 text-xs text-gray-600 font-medium">{{ item.label }}</span>
                <span class="w-1/2 text-xs text-gray-800 font-medium">{{ item.value }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- ---------------------------------------------------------- -->
        <!-- SUPPLIER OFFERS -->
        <!-- ---------------------------------------------------------- -->
        <Card>
          <CardContent class="p-4">
            <h2 class="mb-3 text-sm text-primary font-semibold">
              {{ t('email.offer_display.supplier_offers') }}
            </h2>

            <div class="space-y-3">
              <div
                v-for="group in groupedSupplierOffers"
                :key="group.email"
                class="border rounded-lg p-4 space-y-3"
              >
                <!-- Grup Başlığı -->
                <div class="border-b pb-2">
                  <h3 class="text-sm text-primary font-medium">
                    {{ group.email }}
                  </h3>
                  <p class="text-xs text-muted-foreground">
                    {{ group.companyNames.join(', ') }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ group.contactNames.join(', ') }}
                  </p>
                </div>

                <!-- Teklifler -->
                <div
                  v-for="supplierOffer in group.offers"
                  :key="supplierOffer.id"
                  class="flex cursor-pointer items-start gap-3 border rounded-lg p-3 transition hover:border-yellow-400"
                  @click="handleSupplierOfferSelect(supplierOffer.id, supplierOffer)"
                >
                  <input
                    v-model="selectedSupplierOfferId"
                    type="radio"
                    :value="supplierOffer.id"
                    class="mt-1 accent-primary"
                    @click.stop="handleSupplierOfferSelect(supplierOffer.id, supplierOffer)"
                  >

                  <div class="flex-1">
                    <!-- Detaylar -->
                    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <div class="space-y-1">
                        <div>
                          <h3 class="text-sm text-primary font-medium">
                            {{ t('email.offer_display.supplier_details.price') }}:
                          </h3>
                          <span class="text-sm">{{ supplierOffer.price || '-' }}</span>
                        </div>

                        <div>
                          <h3 class="text-sm text-primary font-medium">
                            {{ t('email.offer_display.supplier_details.note') }}:
                          </h3>
                          <span class="text-sm">{{ supplierOffer.note || '-' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="!offer.SupplierOffer || offer.SupplierOffer.length === 0"
                class="text-center text-sm text-muted-foreground"
              >
                {{ t('email.offer_display.no_supplier_offers') }}
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- ========== CUSTOMER OFFER REQUESTS (hepsi) ========== -->
        <Card>
          <CardContent class="p-4">
            <div
              v-for="req in customerRequests"
              :key="req.id"
              class="mb-3 border rounded-lg bg-gray-50 p-3 shadow-sm last:mb-0 space-y-2"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-500">
                    {{ t('email.offer_display.mail_address') }}: {{ req.address }}
                  </span>
                  <span
                    class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium"
                  >
                    {{ t('email.mail_types.CUSTOMER_NEW_OFFER_REQUEST') }}
                  </span>
                </div>
                <span class="text-xs text-muted-foreground">
                  {{ formatDate(req.createdAt) }}
                </span>
              </div>

              <div class="border-b pb-1">
                <b class="text-sm text-gray-900">{{ req.contentTitle }}</b>
              </div>

              <div class="text-sm text-gray-800" v-html="req.contentBody" />
            </div>
          </CardContent>
        </Card>

        <!-- ========== MÜŞTERİYE GÖNDERİLEN TEKLİFLER ========== -->
        <Card>
          <CardContent class="p-4">
            <h2 class="mb-3 text-sm text-primary font-semibold">
              {{ t('email.offer_display.sent_offers') }}
              <span class="ml-1 text-xs text-muted-foreground">({{ sentOffers.length }})</span>
            </h2>

            <div class="space-y-3">
              <div
                v-for="sentOffer in sentOffers"
                :key="sentOffer.id"
                class="border rounded-lg p-3 transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              >
                <div class="flex items-start justify-between">
                  <div class="space-y-2">
                    <!-- Tedarikçi Bilgileri -->
                    <div v-if="sentOffer.supplierContact">
                      <h3 class="text-sm text-primary font-medium">
                        {{ sentOffer.supplierContact.name }}
                      </h3>
                      <p class="text-xs text-muted-foreground">
                        {{ sentOffer.supplierContact.companyName }}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        {{ sentOffer.supplierContact.email }}
                      </p>
                    </div>

                    <!-- Teklif Detayları -->
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <h4 class="text-xs text-gray-600 font-medium dark:text-gray-400">
                          {{ t('email.offer_display.sent_offer_details.price') }}
                        </h4>
                        <p class="text-sm">
                          {{ sentOffer.price }}
                        </p>
                      </div>
                      <div>
                        <h4 class="text-xs text-gray-600 font-medium dark:text-gray-400">
                          {{ t('email.offer_display.sent_offer_details.note') }}
                        </h4>
                        <p class="text-sm">
                          {{ sentOffer.note || '-' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Tarih -->
                  <span class="text-xs text-muted-foreground">
                    {{ formatDate(sentOffer.createdAt) }}
                  </span>
                </div>
              </div>

              <div
                v-if="sentOffers.length === 0"
                class="text-center text-sm text-muted-foreground"
              >
                {{ t('email.offer_display.no_sent_offers') }}
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- ---------------------------------------------------------- -->
        <!-- SEND OFFER DIALOG (TipTap içerir) -->
        <!-- ---------------------------------------------------------- -->
        <Dialog v-model:open="showSendOfferDialog">
          <DialogContent class="max-h-[80vh] max-w-5xl w-full overflow-y-auto">
            <DialogHeader>
              <DialogTitle class="text-sm">
                {{ t('email.send_offer_title') }}
              </DialogTitle>
              <DialogDescription class="text-xs">
                {{ t('email.send_offer_description') }}
              </DialogDescription>
            </DialogHeader>

            <form class="space-y-4" @submit.prevent="sendOfferToCustomer">
              <!-- Alıcı -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium">
                  {{ t('email.customer_email') }}
                </label>
                <input
                  v-model="sendOfferForm.email"
                  type="email"
                  class="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800"
                  required
                >
              </div>

              <!-- Konu -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium">
                  {{ t('email.subject') }}
                </label>
                <input
                  v-model="sendOfferForm.subject"
                  type="text"
                  class="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800"
                  required
                >
              </div>

              <!-- İçerik (TipTap) -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium">
                  {{ t('email.content') }}
                </label>

                <!-- Toolbar -->
                <div class="flex items-center gap-2 border-b bg-gray-50 px-3 py-2 dark:bg-gray-800">
                  <button
                    type="button" :class="active('bold')"
                    @click="editor?.chain().focus().toggleBold().run()"
                  >
                    <Icon name="lucide:bold" class="h-4 w-4" />
                  </button>
                  <button
                    type="button" :class="active('italic')"
                    @click="editor?.chain().focus().toggleItalic().run()"
                  >
                    <Icon name="lucide:italic" class="h-4 w-4" />
                  </button>
                  <button
                    type="button" :class="active('underline')"
                    @click="editor?.chain().focus().toggleUnderline().run()"
                  >
                    <Icon name="lucide:underline" class="h-4 w-4" />
                  </button>

                  <div class="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-600" />

                  <button
                    type="button" :class="active('bulletList')"
                    @click="editor?.chain().focus().toggleBulletList().run()"
                  >
                    <Icon name="lucide:list" class="h-4 w-4" />
                  </button>
                  <button
                    type="button" :class="active('orderedList')"
                    @click="editor?.chain().focus().toggleOrderedList().run()"
                  >
                    <Icon name="lucide:list-ordered" class="h-4 w-4" />
                  </button>
                </div>

                <!-- Editor -->
                <EditorContent
                  :editor="editor"
                  class="min-h-[350px] overflow-y-auto whitespace-pre-wrap p-3 focus:outline-none"
                />

                <!-- Ön İzleme -->
                <div class="mt-2">
                  <button
                    type="button"
                    class="mb-1 text-xs text-primary underline"
                    @click="previewOpen = !previewOpen"
                  >
                    {{ previewOpen ? t('email.hide_preview') : t('email.show_preview') }}
                  </button>

                  <transition name="fade">
                    <div
                      v-if="previewOpen"
                      class="min-h-[80px] border rounded bg-gray-50 p-2 text-sm dark:bg-gray-800"
                      v-html="sendOfferForm.content"
                    />
                  </transition>
                </div>
              </div>

              <!-- Aksiyon Butonları -->
              <div class="flex justify-end gap-2">
                <Button
                  variant="outline" type="button" class="px-3 py-2 text-sm"
                  @click="closeSendOfferDialog"
                >
                  {{ t('common.cancel') }}
                </Button>
                <Button type="submit" class="px-3 py-2 text-sm">
                  {{ t('common.send') }}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <!-- ============== MAIL LOGS ====================== -->
        <Card>
          <CardContent class="p-4">
            <div
              class="flex cursor-pointer items-center justify-between"
              @click="toggleMailGroup('mail_logs')"
            >
              <h2 class="text-sm text-primary font-semibold">
                {{ t('email.offer_display.mail_logs') }}
                <span class="ml-2 text-xs text-muted-foreground">
                  ({{ offer.mailLogs?.length || 0 }})
                </span>
              </h2>
              <button class="text-primary">
                <Icon
                  :name="expandedMailGroups.has('mail_logs')
                    ? 'lucide:chevron-up'
                    : 'lucide:chevron-down'"
                  class="h-4 w-4"
                />
              </button>
            </div>

            <!-- Gruplar -->
            <div v-if="expandedMailGroups.has('mail_logs')" class="mt-3 space-y-3">
              <div
                v-if="offer.mailLogs && offer.mailLogs.length"
                class="space-y-3"
              >
                <!-- Bir adres grubu -->
                <div
                  v-for="group in offer.mailLogs"
                  :key="group.address"
                  class="space-y-3"
                >
                  <!-- Adres başlığı -->
                  <div
                    class="flex cursor-pointer items-center justify-between"
                    @click="toggleMailGroup(group.address)"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium">{{ group.address }}</span>
                      <span class="text-xs text-muted-foreground">
                        ({{ group.logs.length }})
                      </span>
                    </div>
                    <button class="text-primary">
                      <Icon
                        :name="expandedMailGroups.has(group.address)
                          ? 'lucide:chevron-up'
                          : 'lucide:chevron-down'"
                        class="h-4 w-4"
                      />
                    </button>
                  </div>

                  <!-- O adrese ait mailler -->
                  <div v-if="expandedMailGroups.has(group.address)" class="space-y-3">
                    <div
                      v-for="mail in group.logs"
                      :key="mail.id"
                      class="border rounded-lg bg-gray-50 p-3 shadow-sm"
                    >
                      <div class="mb-2 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="text-xs text-gray-500">
                            {{ group.type === 'to'
                              ? t('email.offer_display.mail_address')
                              : t('email.display.reply_to') }}
                            : {{ group.address }}
                          </span>
                          <span
                            class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium"
                          >
                            {{ t(`email.mail_types.${mail.type}`) }}
                          </span>
                        </div>
                        <span class="text-xs text-muted-foreground">
                          {{ formatDate(mail.createdAt) }}
                        </span>
                      </div>

                      <div class="mb-2 border-b pb-2">
                        <b class="text-sm text-gray-900">{{ mail.contentTitle }}</b>
                      </div>

                      <div
                        class="text-sm text-gray-800"
                        v-html="mail.contentBody || t('email.offer_display.no_content')"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
