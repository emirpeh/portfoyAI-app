<template>
  <div>
    <div v-if="listing">
      <h1>{{ listing.title }}</h1>
      <p><strong>Fiyat:</strong> {{ listing.price }}</p>
      <p><strong>Açıklama:</strong> {{ listing.description }}</p>
      <!-- Diğer ilan detayları buraya gelecek -->
    </div>
    <div v-else>
      <p>İlan yükleniyor veya bulunamadı...</p>
    </div>
    <NuxtLink to="/real-estate">Tüm İlanlara Geri Dön</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const listingId = computed(() => route.params.id);

// Örnek: Tek bir ilanı çekmek için composable kullanılabilir
// const { data: listing, pending, error } = await useFetchListing(listingId.value);

// Şimdilik örnek bir veri kullanalım
const listing = ref<any>(null);

const fetchListingDetails = async (id: string | string[]) => {
  // Burada API'den ilan detayları çekilecek
  console.log(`İlan detayları getiriliyor: ${id}`);
  // Örnek veri:
  await new Promise(resolve => setTimeout(resolve, 500)); // API çağrısını simüle et
  if (id === '123') {
    listing.value = {
      id: '123',
      title: 'Harika Konumda Satılık Daire',
      price: '2.500.000 TL',
      description: 'Şehrin merkezinde, ulaşımı kolay, ferah ve aydınlık daire.',
      // ... diğer özellikler
    };
  } else {
    listing.value = null;
  }
};

watch(
  listingId,
  async (newId) => {
    if (newId) {
      await fetchListingDetails(newId);
    }
  },
  { immediate: true }
);

definePageMeta({
  middleware: ['auth'] // Örnek
});

useHead(() => ({
  title: listing.value ? listing.value.title : 'İlan Detayı',
}));

</script>

<style scoped>
/* Sayfa özel stilleri */
</style> 