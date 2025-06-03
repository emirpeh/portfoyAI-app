<template>
  <div>
    <h1>Alıcı Tercihlerim</h1>
    <p>Bu bölümde emlak arama tercihlerinizi belirleyebilir ve güncelleyebilirsiniz.</p>
    <!-- Alıcı tercihleri formu için yer tutucu -->
    <!-- <BuyerPreferencesForm :preferences="userPreferences" @save="handleSavePreferences" /> -->
    <form @submit.prevent="handleSavePreferences">
      <div>
        <label for="location">Konum:</label>
        <input type="text" id="location" v-model="preferences.location" />
      </div>
      <div>
        <label for="priceMin">Minimum Fiyat:</label>
        <input type="number" id="priceMin" v-model.number="preferences.priceMin" />
      </div>
      <div>
        <label for="priceMax">Maksimum Fiyat:</label>
        <input type="number" id="priceMax" v-model.number="preferences.priceMax" />
      </div>
      <div>
        <label for="propertyType">Emlak Tipi:</label>
        <select id="propertyType" v-model="preferences.propertyType">
          <option value="">Tümü</option>
          <option value="daire">Daire</option>
          <option value="villa">Villa</option>
          <option value="isyeri">İş Yeri</option>
        </select>
      </div>
      <button type="submit">Tercihleri Kaydet</button>
    </form>
    <p v-if="saveStatus">{{ saveStatus }}</p>
  </div>
</template>

<script setup lang="ts">
// import BuyerPreferencesForm from '~/components/profile/BuyerPreferencesForm.vue';

const preferences = ref({
  location: '',
  priceMin: null,
  priceMax: null,
  propertyType: '',
  // ... diğer tercihler
});
const saveStatus = ref('');

// Kullanıcının mevcut tercihlerini API'den çekme mantığı eklenecek
// const { data: userPreferences, pending, error } = await useFetchUserPreferences();
// watch(userPreferences, (newPrefs) => { if (newPrefs) preferences.value = { ...newPrefs }; }, { immediate: true });

const handleSavePreferences = async () => {
  saveStatus.value = 'Kaydediliyor...';
  console.log('Tercihler kaydediliyor:', preferences.value);
  // Burada API'ye tercihleri kaydetme mantığı eklenecek
  // await useSaveUserPreferences(preferences.value);
  await new Promise(resolve => setTimeout(resolve, 1000)); // API çağrısını simüle et
  saveStatus.value = 'Tercihler başarıyla kaydedildi!';
  setTimeout(() => saveStatus.value = '', 3000);
};

definePageMeta({
  middleware: ['auth'] // Bu sayfa kimlik doğrulama gerektirir
});

useHead({
  title: 'Alıcı Tercihlerim',
});
</script>

<style scoped>
form div {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.25rem;
}
input,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style> 