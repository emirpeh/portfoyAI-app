export interface BuyerPreference {
  id?: string; // Veritabanından gelirse
  userId: string | number; // Hangi kullanıcıya ait olduğu
  location?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  propertyType?: string;
  roomCount?: string;
  minSize?: number | null; // metrekare
  maxSize?: number | null; // metrekare
  features?: string[];
  // ...diğer tercihler
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface MatchedListing {
  // RealEstateListing arayüzünden miras alabilir veya temel bilgileri içerebilir
  id: string | number;
  title: string;
  price: number;
  currency: string;
  propertyType: string;
  address: { city: string; district: string; };
  matchScore?: number; // Eşleşme skoru (opsiyonel)
  // ... diğer özet bilgiler
}

export const useBuyerPreferences = (userId: Ref<string | number | null>) => {
  const { $apiFetch } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  const API_BASE_URL = runtimeConfig.public.apiBaseUrl;

  const preferences: Ref<BuyerPreference | null> = ref(null);
  const matchedListings: Ref<MatchedListing[]> = ref([]);
  const isLoadingPreferences: Ref<boolean> = ref(false);
  const isLoadingMatched: Ref<boolean> = ref(false);
  const error: Ref<any> = ref(null);

  const fetchPreferences = async () => {
    if (!userId.value) {
      preferences.value = null;
      return;
    }
    isLoadingPreferences.value = true;
    error.value = null;
    try {
      // Örnek API endpoint: /users/{userId}/preferences
      // preferences.value = await $apiFetch<BuyerPreference>(`/users/${userId.value}/preferences`);
      console.log(`User preferences fetched (simulation): User ${userId.value}`);
      // Örnek statik veri:
      await new Promise(resolve => setTimeout(resolve, 500));
      preferences.value = {
        userId: userId.value,
        location: 'Kadıköy',
        minPrice: 1000000,
        maxPrice: 3000000,
        propertyType: 'daire',
        roomCount: '2+1',
      };
    } catch (err) {
      error.value = err;
      console.error('Tercihler çekilirken hata:', err);
      preferences.value = null;
    } finally {
      isLoadingPreferences.value = false;
    }
  };

  const savePreferences = async (prefsData: Omit<BuyerPreference, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!userId.value) throw new Error('User ID not found.');
    isLoadingPreferences.value = true;
    error.value = null;
    try {
      const payload = { ...prefsData, userId: userId.value };
      // Örnek API endpoint: POST veya PUT /users/{userId}/preferences
      // preferences.value = await $apiFetch<BuyerPreference>(`/users/${userId.value}/preferences`, {
      //   method: preferences.value?.id ? 'PUT' : 'POST',
      //   body: payload,
      // });
      console.log('User preferences saved (simulation):', payload);
      await new Promise(resolve => setTimeout(resolve, 700));
      preferences.value = { ...(preferences.value || {}), ...payload, id: preferences.value?.id || Date.now().toString() } as BuyerPreference;
      return preferences.value;
    } catch (err) {
      error.value = err;
      console.error('Tercihler kaydedilirken hata:', err);
      throw err;
    } finally {
      isLoadingPreferences.value = false;
    }
  };

  const fetchMatchedListings = async () => {
    if (!userId.value || !preferences.value) {
        matchedListings.value = [];
        return;
    }
    isLoadingMatched.value = true;
    error.value = null;
    try {
        // Örnek API endpoint: /users/{userId}/matched-listings veya /listings/match (body ile preference gönderilir)
        // matchedListings.value = await $apiFetch<MatchedListing[]>(`/users/${userId.value}/matched-listings`);
        console.log('Matched listings fetched (simulation)');
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Örnek statik veri (preferences.value'ye göre filtrelenmiş gibi davranalım):
        matchedListings.value = [
            { id: '101', title: 'Kadıköy\'de Fırsat Daire', price: 2800000, currency: 'TRY', propertyType: 'daire', address: {city: 'İstanbul', district: 'Kadıköy'} },
            { id: '102', title: 'Moda\'da Manzaralı Ev', price: 2950000, currency: 'TRY', propertyType: 'daire', address: {city: 'İstanbul', district: 'Kadıköy'} },
        ];
    } catch (err) {
        error.value = err;
        console.error('Error fetching matched listings:', err);
        matchedListings.value = [];
    } finally {
        isLoadingMatched.value = false;
    }
  };

  // Kullanıcı ID'si değiştiğinde tercihleri otomatik çek
  watch(userId, fetchPreferences, { immediate: true });

  return {
    preferences,
    matchedListings,
    isLoadingPreferences,
    isLoadingMatched,
    error,
    fetchPreferences,
    savePreferences,
    fetchMatchedListings,
  };
}; 