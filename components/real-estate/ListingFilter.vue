<template>
  <div class="listing-filter bg-gray-100 p-4 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-3">Filtrele</h3>
    <form @submit.prevent="applyFilters">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label for="filter-keyword" class="block text-sm font-medium text-gray-700">Anahtar Kelime</label>
          <input type="text" id="filter-keyword" v-model="filters.keyword" placeholder="Başlık, açıklama..." class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
        </div>
        <div>
          <label for="filter-city" class="block text-sm font-medium text-gray-700">Şehir</label>
          <input type="text" id="filter-city" v-model="filters.city" placeholder="örn: İstanbul" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
        </div>
        <div>
          <label for="filter-propertyType" class="block text-sm font-medium text-gray-700">Emlak Tipi</label>
          <select id="filter-propertyType" v-model="filters.propertyType" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            <option value="">Tümü</option>
            <option value="daire">Daire</option>
            <option value="villa">Villa</option>
            <option value="isyeri">İş Yeri</option>
            <option value="arsa">Arsa</option>
          </select>
        </div>
        <div>
          <label for="filter-minPrice" class="block text-sm font-medium text-gray-700">Min. Fiyat</label>
          <input type="number" id="filter-minPrice" v-model.number="filters.minPrice" placeholder="0" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
        </div>
        <div>
          <label for="filter-maxPrice" class="block text-sm font-medium text-gray-700">Maks. Fiyat</label>
          <input type="number" id="filter-maxPrice" v-model.number="filters.maxPrice" placeholder="Sınırsız" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
        </div>
        <!-- Daha fazla filtre eklenebilir (oda sayısı, m², vb.) -->
      </div>
      <div class="mt-4 flex justify-end space-x-2">
        <button type="button" @click="resetFilters" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Sıfırla</button>
        <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Uygula</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Filters {
  keyword?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  // ... diğer filtre alanları
}

const emit = defineEmits(['filter-changed']);

const initialFilters: Filters = {
  keyword: '',
  city: '',
  propertyType: '',
  minPrice: null,
  maxPrice: null,
};

const filters = ref<Filters>({ ...initialFilters });

const applyFilters = () => {
  // Sadece dolu olan filtreleri gönder
  const activeFilters = Object.entries(filters.value).reduce((acc, [key, value]) => {
    if (value !== null && value !== '') {
      acc[key as keyof Filters] = value;
    }
    return acc;
  }, {} as Filters);
  emit('filter-changed', activeFilters);
};

const resetFilters = () => {
  filters.value = { ...initialFilters };
  emit('filter-changed', {}); // Boş filtrelerle sıfırla
};

// Otomatik filtreleme için watch kullanılabilir (opsiyonel)
// watch(filters, applyFilters, { deep: true });
</script>

<style scoped>
/* Bileşen özel stilleri */
</style> 