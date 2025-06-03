<template>
  <form @submit.prevent="submitForm" class="buyer-preferences-form space-y-6">
    <div>
      <label for="pref-location" class="block text-sm font-medium text-gray-700">İstenen Konum(lar)</label>
      <input type="text" id="pref-location" v-model="editablePreferences.location" placeholder="örn: Beşiktaş, Kadıköy" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="pref-minPrice" class="block text-sm font-medium text-gray-700">Minimum Fiyat</label>
        <input type="number" id="pref-minPrice" v-model.number="editablePreferences.minPrice" placeholder="0" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
      </div>
      <div>
        <label for="pref-maxPrice" class="block text-sm font-medium text-gray-700">Maksimum Fiyat</label>
        <input type="number" id="pref-maxPrice" v-model.number="editablePreferences.maxPrice" placeholder="Sınırsız" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
      </div>
    </div>

    <div>
      <label for="pref-propertyType" class="block text-sm font-medium text-gray-700">Emlak Tipi</label>
      <select id="pref-propertyType" v-model="editablePreferences.propertyType" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
        <option value="">Tümü</option>
        <option value="daire">Daire</option>
        <option value="villa">Villa</option>
        <option value="isyeri">İş Yeri</option>
        <option value="arsa">Arsa</option>
      </select>
    </div>

    <div>
      <label for="pref-roomCount" class="block text-sm font-medium text-gray-700">Oda Sayısı</label>
      <input type="text" id="pref-roomCount" v-model="editablePreferences.roomCount" placeholder="örn: 2+1, 3+1" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
    </div>
    
    <!-- Diğer tercih alanları eklenebilir (m², bina yaşı, özellikler vb.) -->

    <div class="flex justify-end">
      <button type="submit" :disabled="isSaving" class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
        {{ isSaving ? 'Kaydediliyor...' : 'Tercihleri Kaydet' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PropType } from 'vue';

interface BuyerPreferences {
  location?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  propertyType?: string;
  roomCount?: string;
  // ...diğer tercihler
}

const props = defineProps({
  initialPreferences: {
    type: Object as PropType<BuyerPreferences>,
    default: () => ({}),
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['save-preferences']);

const editablePreferences = ref<BuyerPreferences>({});

watch(() => props.initialPreferences, (newPrefs) => {
  editablePreferences.value = { ...newPrefs };
}, { immediate: true, deep: true });

const submitForm = () => {
  emit('save-preferences', { ...editablePreferences.value });
};

</script>

<style scoped>
/* Form stilleri */
</style> 