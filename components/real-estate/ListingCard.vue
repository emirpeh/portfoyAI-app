<template>
  <div class="listing-card border p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    <NuxtLink :to="`/real-estate/${listing.id}`">
      <!-- İlan resmi için yer tutucu -->
      <div v-if="listing.imageUrl" class="mb-2">
        <img :src="listing.imageUrl" :alt="listing.title" class="w-full h-48 object-cover rounded">
      </div>
      <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-2">
        <span class="text-gray-500">Resim Yok</span>
      </div>

      <h3 class="text-xl font-semibold mb-1">{{ listing.title }}</h3>
      <p class="text-lg text-blue-600 font-bold mb-2">{{ formatPrice(listing.price) }} {{ listing.currency || 'TL' }}</p>
      <p class="text-sm text-gray-600 mb-1">{{ listing.address?.city }}, {{ listing.address?.district }}</p>
      <p class="text-sm text-gray-600">{{ listing.propertyType }} - {{ listing.roomCount }}</p>
      <!-- Diğer özet bilgiler eklenebilir -->
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

interface ListingAddress {
  street?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  country?: string;
}

interface Listing {
  id: string | number;
  title: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  address?: ListingAddress;
  propertyType?: string;
  roomCount?: string; // Örneğin '3+1', '2+1'
  // ...diğer ilan özellikleri
}

const props = defineProps({
  listing: {
    type: Object as PropType<Listing>,
    required: true,
  },
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('tr-TR').format(price);
};
</script>

<style scoped>
.listing-card {
  /* İhtiyaç duyulursa ek stiller */
}
</style> 