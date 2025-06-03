<template>
  <div class="listing-form p-4 border rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-6">{{ formTitle }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">İlan Başlığı*</label>
          <input type="text" id="title" v-model="formData.title" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
          <!-- <span v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</span> -->
        </div>

        <div>
          <label for="propertyType" class="block text-sm font-medium text-gray-700">Emlak Tipi*</label>
          <select id="propertyType" v-model="formData.propertyType" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            <option disabled value="">Lütfen seçin</option>
            <option value="daire">Daire</option>
            <option value="villa">Villa</option>
            <option value="isyeri">İş Yeri</option>
            <option value="arsa">Arsa</option>
            <!-- Diğer tipler -->
          </select>
        </div>

        <div>
          <label for="price" class="block text-sm font-medium text-gray-700">Fiyat*</label>
          <input type="number" id="price" v-model.number="formData.price" required placeholder="0" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
        </div>

        <div>
          <label for="currency" class="block text-sm font-medium text-gray-700">Para Birimi*</label>
          <select id="currency" v-model="formData.currency" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            <option value="TRY">TL</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label for="description" class="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea id="description" v-model="formData.description" rows="4" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>

        <div>
          <label for="city" class="block text-sm font-medium text-gray-700">Şehir*</label>
          <input type="text" id="city" v-model="formData.address.city" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
        </div>

        <div>
          <label for="district" class="block text-sm font-medium text-gray-700">İlçe*</label>
          <input type="text" id="district" v-model="formData.address.district" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
        </div>

         <!-- Diğer alanlar eklenecek: oda sayısı, m2, resim yükleme vb. -->
      </div>

      <div class="mt-8 flex justify-end">
        <button type="button" @click="handleCancel" class="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">İptal</button>
        <button type="submit" :disabled="isSubmitting" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
          {{ isSubmitting ? 'Kaydediliyor...' : (listingToEdit ? 'Güncelle' : 'Kaydet') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { PropType } from 'vue';

interface ListingAddressForm {
  street?: string;
  city: string;
  district: string;
  postalCode?: string;
  country?: string;
}

interface ListingFormData {
  id?: string | number;
  title: string;
  description?: string;
  price: number | null;
  currency: 'TRY' | 'USD' | 'EUR';
  propertyType: string; // 'daire', 'villa' etc.
  address: ListingAddressForm;
  // ...daha fazla alan (örn: roomCount, size, features, images)
}

const props = defineProps({
  listingToEdit: {
    type: Object as PropType<ListingFormData | null>,
    default: null,
  },
});

const emit = defineEmits(['submit-form', 'cancel']);

const initialFormData: ListingFormData = {
  title: '',
  description: '',
  price: null,
  currency: 'TRY',
  propertyType: '',
  address: {
    city: '',
    district: '',
  },
};

const formData = ref<ListingFormData>({ ...initialFormData });
const isSubmitting = ref(false);
// const errors = ref<Partial<Record<keyof ListingFormData, string>>>({}); // Zod/VeeValidate ile entegre edilebilir

const formTitle = computed(() => props.listingToEdit ? 'İlanı Düzenle' : 'Yeni İlan Oluştur');

watch(() => props.listingToEdit, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal }; // Derin kopyalama gerekebilir veya alanları tek tek ata
  } else {
    formData.value = { ...initialFormData };
  }
}, { immediate: true, deep: true });

const validateForm = (): boolean => {
  // errors.value = {};
  // Basit bir validasyon, Zod/VeeValidate ile geliştirilmeli
  if (!formData.value.title) { /* errors.value.title = 'Başlık zorunludur.'; */ return false; }
  if (!formData.value.price || formData.value.price <= 0) { /* errors.value.price = 'Geçerli bir fiyat girin.'; */ return false; }
  if (!formData.value.propertyType) { /* errors.value.propertyType = 'Emlak tipi seçin.'; */ return false; }
  if (!formData.value.address.city) { /* errors.value.address = 'Şehir zorunludur.'; */ return false; }
  if (!formData.value.address.district) { /* errors.value.address = 'İlçe zorunludur.'; */ return false; }
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    // İsteğe bağlı olarak kullanıcıya bir uyarı gösterilebilir.
    console.warn("Form validasyonu başarısız.");
    return;
  }
  isSubmitting.value = true;
  try {
    // formData.value içindeki gereksiz alanları veya null değerleri temizle
    const payload = { ...formData.value };
    // API'ye göndermeden önce payload'ı hazırla
    emit('submit-form', payload);
    // Başarılı olursa formu sıfırla veya yönlendir
    // if (!props.listingToEdit) {
    //   formData.value = { ...initialFormData };
    // }
  } catch (error) {
    console.error('İlan kaydedilirken hata:', error);
    // Kullanıcıya hata mesajı göster
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
};

</script>

<style scoped>
/* Form stilleri */
</style> 