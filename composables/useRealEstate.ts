// İlan ve adres arayüzleri ListingCard.vue ve ListingForm.vue içerisinden alınabilir veya burada merkezi olarak tanımlanabilir.
interface ListingAddress {
  street?: string;
  city: string;
  district: string;
  postalCode?: string;
  country?: string;
}

export interface RealEstateListing {
  id: string | number;
  title: string;
  description?: string;
  price: number;
  currency: string;
  propertyType: string;
  address: ListingAddress;
  imageUrl?: string;
  roomCount?: string;
  size?: number; // metrekare
  features?: string[];
  // ...diğer ilan özellikleri
  createdAt?: string | Date;
  updatedAt?: string | Date;
  agentId?: string | number;
}

interface FetchListingsOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, any>; // keyword, city, propertyType, minPrice, maxPrice etc.
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useRealEstate = () => {
  const { $apiFetch } = useNuxtApp(); // veya doğrudan useFetch/useAsyncData
  const runtimeConfig = useRuntimeConfig();
  const API_BASE_URL = runtimeConfig.public.apiBaseUrl;

  const listings: Ref<RealEstateListing[]> = ref([]);
  const currentListing: Ref<RealEstateListing | null> = ref(null);
  const isLoading: Ref<boolean> = ref(false);
  const error: Ref<any> = ref(null);
  const totalListings: Ref<number> = ref(0);

  const fetchListings = async (options: FetchListingsOptions = {}) => {
    isLoading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);
      if (options.filters) {
        for (const key in options.filters) {
          if (options.filters[key] !== null && options.filters[key] !== '') {
            params.append(key, options.filters[key].toString());
          }
        }
      }
      // Örnek API endpoint: /real-estate-listings
      const response = await $apiFetch<{ data: RealEstateListing[], total: number }>(`/listings?${params.toString()}`);
      // const response = await useFetch<{ data: RealEstateListing[], total: number }>(`${API_BASE_URL}/listings?${params.toString()}`); // Eğer $apiFetch yoksa
      
      // Gelen yanıta göre listings.value ve totalListings.value güncellenecek
      // listings.value = response.data;
      // totalListings.value = response.total;
      console.log(`Listings fetched (simulation): ${params.toString()}`);
      // Örnek statik veri:
      listings.value = [
        { id: '1', title: 'Sahibinden Acil Satılık', price: 1500000, currency: 'TRY', propertyType: 'daire', address: { city: 'İstanbul', district: 'Beşiktaş'}, roomCount: '2+1' },
        { id: '2', title: 'Kelepir Villa Fırsatı', price: 4500000, currency: 'TRY', propertyType: 'villa', address: { city: 'İzmir', district: 'Urla'}, roomCount: '5+2' },
      ];
      totalListings.value = listings.value.length;

    } catch (err) {
      error.value = err;
      console.error('Error fetching listings:', err);
      listings.value = [];
      totalListings.value = 0;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchListingById = async (id: string | number) => {
    isLoading.value = true;
    error.value = null;
    currentListing.value = null;
    try {
      // Örnek API endpoint: /real-estate-listings/{id}
      // const response = await $apiFetch<RealEstateListing>(`/listings/${id}`);
      // currentListing.value = response;
      console.log(`Single listing fetched (simulation): ${id}`);
      const found = listings.value.find((l: RealEstateListing) => l.id.toString() === id.toString());
      currentListing.value = found || null;
      if (!found) throw new Error('Listing not found');
    } catch (err) {
      error.value = err;
      console.error(`Error fetching listing ${id}:`, err);
    } finally {
      isLoading.value = false;
    }
  };

  const createListing = async (listingData: Omit<RealEstateListing, 'id' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true;
    error.value = null;
    try {
      // Örnek API endpoint: POST /real-estate-listings
      // const newListing = await $apiFetch<RealEstateListing>('/listings', { method: 'POST', body: listingData });
      // listings.value.unshift(newListing); // Yeni ilanı listeye ekle
      // totalListings.value++;
      // return newListing;
      console.log('New listing created (simulation):', listingData);
      const newListing = { ...listingData, id: Date.now().toString(), createdAt: new Date().toISOString() } as RealEstateListing;
      listings.value.unshift(newListing);
      totalListings.value++;
      return newListing;
    } catch (err) {
      error.value = err;
      console.error('Error creating listing:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateListing = async (id: string | number, listingData: Partial<Omit<RealEstateListing, 'id' | 'createdAt' | 'updatedAt'>>) => {
    isLoading.value = true;
    error.value = null;
    try {
      // Örnek API endpoint: PUT /real-estate-listings/{id}
      // const updated = await $apiFetch<RealEstateListing>(`/listings/${id}`, { method: 'PUT', body: listingData });
      // const index = listings.value.findIndex(l => l.id === id);
      // if (index !== -1) listings.value[index] = updated;
      // if (currentListing.value && currentListing.value.id === id) currentListing.value = updated;
      // return updated;
      console.log(`Listing updated (simulation): ${id}`, listingData);
      const index = listings.value.findIndex((l: RealEstateListing) => l.id.toString() === id.toString());
      if (index !== -1) {
        listings.value[index] = { ...listings.value[index], ...listingData, updatedAt: new Date().toISOString() } as RealEstateListing;
        if (currentListing.value && currentListing.value.id.toString() === id.toString()) {
          currentListing.value = listings.value[index];
        }
        return listings.value[index];
      }
      throw new Error('Listing to update not found');
    } catch (err) {
      error.value = err;
      console.error(`Error updating listing ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteListing = async (id: string | number) => {
    isLoading.value = true;
    error.value = null;
    try {
      // Örnek API endpoint: DELETE /real-estate-listings/{id}
      // await $apiFetch(`/listings/${id}`, { method: 'DELETE' });
      // listings.value = listings.value.filter(l => l.id !== id);
      // totalListings.value--;
      console.log(`Listing deleted (simulation): ${id}`);
      const initialLength = listings.value.length;
      listings.value = listings.value.filter((l: RealEstateListing) => l.id.toString() !== id.toString());
      if (listings.value.length < initialLength) totalListings.value--;
      else throw new Error('Listing to delete not found');

    } catch (err) {
      error.value = err;
      console.error(`Error deleting listing ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    listings,
    currentListing,
    isLoading,
    error,
    totalListings,
    fetchListings,
    fetchListingById,
    createListing,
    updateListing,
    deleteListing,
  };
}; 