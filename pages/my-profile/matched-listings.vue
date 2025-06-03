<template>
  <div>
    <h1>Tercihlerimle Eşleşen İlanlar</h1>
    <div v-if="isLoading">
      <p>Eşleşen ilanlar yükleniyor...</p>
    </div>
    <div v-else-if="matchedListings && matchedListings.length > 0">
      <p>Aşağıda arama tercihlerinize göre sizin için uygun olabilecek ilanlar listelenmiştir.</p>
      <!-- Eşleşen ilanlar için listeleme (Örnek ListingCard kullanılabilir) -->
      <!-- <RealEstateListingCard v-for="listing in matchedListings" :key="listing.id" :listing="listing" /> -->
      <div v-for="listing in matchedListings" :key="listing.id" class="listing-item">
        <h3>
          <NuxtLink :to="`/real-estate/${listing.id}`">{{ listing.title }}</NuxtLink>
        </h3>
        <p>Fiyat: {{ listing.price }}</p>
      </div>
    </div>
    <div v-else>
      <p>Şu anda tercihlerinize uygun bir ilan bulunmamaktadır.</p>
      <NuxtLink to="/my-profile/preferences">Arama tercihlerinizi güncellemek ister misiniz?</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// import RealEstateListingCard from '~/components/real-estate/ListingCard.vue';

const isLoading = ref(true);
const matchedListings = ref<any[]>([]);

// Kullanıcının tercihleriyle eşleşen ilanları API'den çekme mantığı eklenecek
// const { data, pending, error } = await useFetchMatchedListings();
// watch(data, (newListings) => { if (newListings) matchedListings.value = newListings; }, { immediate: true });
// watch(pending, (newVal) => isLoading.value = newVal );

const fetchMatched = async () => {
  isLoading.value = true;
  console.log('Eşleşen ilanlar getiriliyor...');
  await new Promise(resolve => setTimeout(resolve, 1500)); // API çağrısını simüle et
  // Örnek veri:
  matchedListings.value = [
    { id: '456', title: 'Yatırımlık Arsa', price: '5.000.000 TL' },
    { id: '789', title: 'Geniş Aileler İçin Dubleks', price: '3.250.000 TL' },
  ];
  // matchedListings.value = []; // Boş durum testi için
  isLoading.value = false;
};

onMounted(async () => {
  await fetchMatched();
});

definePageMeta({
  middleware: ['auth'] // Bu sayfa kimlik doğrulama gerektirir
});

useHead({
  title: 'Eşleşen İlanlar',
});
</script>

<style scoped>
.listing-item {
  border: 1px solid #eee;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}
</style> 