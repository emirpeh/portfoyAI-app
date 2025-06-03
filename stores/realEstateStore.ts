import { defineStore } from 'pinia';
import type { RealEstateListing } from '~/composables/useRealEstate'; // useRealEstate'den arayüzü al

interface RealEstateFilters {
  keyword?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  // ... diğer filtreler
}

export const useRealEstateStore = defineStore('realEstate', {
  state: () => ({
    listings: [] as RealEstateListing[],
    selectedListing: null as RealEstateListing | null,
    filters: {} as RealEstateFilters,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    isLoading: false,
    error: null as any,
  }),

  getters: {
    totalPages: (state) => {
      if (state.totalItems === 0 || state.itemsPerPage === 0) return 1;
      return Math.ceil(state.totalItems / state.itemsPerPage);
    },
    // Başka getter'lar eklenebilir
  },

  actions: {
    // Bu store, useRealEstate composable'ı ile birlikte çalışacak.
    // Composable API çağrılarını yaparken, bu store global state'i (özellikle filtreler ve sayfalama)
    // senkronize etmek veya global erişim sağlamak için kullanılabilir.

    setListings(listings: RealEstateListing[]) {
      this.listings = listings;
    },

    setSelectedListing(listing: RealEstateListing | null) {
      this.selectedListing = listing;
    },

    setFilters(newFilters: RealEstateFilters) {
      // Filtreler değiştiğinde currentPage'i sıfırla
      if (JSON.stringify(this.filters) !== JSON.stringify(newFilters)) {
        this.currentPage = 1;
      }
      this.filters = { ...this.filters, ...newFilters };
      // Burada fetchListings eylemi tetiklenebilir (eğer API çağrıları store'dan yönetilecekse)
    },

    clearFilters() {
      this.filters = {};
      this.currentPage = 1;
      // Burada fetchListings eylemi tetiklenebilir
    },

    setCurrentPage(page: number) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        // Burada fetchListings eylemi tetiklenebilir
      }
    },

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    setError(error: any) {
      this.error = error;
    },
    
    setTotalItems(total: number) {
        this.totalItems = total;
    }

    // Örnek: API çağrısını store üzerinden yönetmek:
    /*
    async fetchListingsFromApi() {
      this.setLoading(true);
      try {
        // const { listings, totalItems } = await useRealEstate().fetchListings({ 
        //   page: this.currentPage,
        //   limit: this.itemsPerPage,
        //   filters: this.filters
        // }); // Bu direkt composable kullanımı yerine API servisi çağrılabilir
        // this.setListings(listings.value); // Eğer composable ref döndürüyorsa .value gerekir
        // this.setTotalItems(totalItems.value);
      } catch (e) {
        this.setError(e);
      } finally {
        this.setLoading(false);
      }
    }
    */
  },
  persist: {
    // Filtrelerin veya sayfa numarasının kalıcı olması istenirse:
    // storage: persistedState.localStorage, 
    // paths: ['filters', 'currentPage'],
  },
}); 