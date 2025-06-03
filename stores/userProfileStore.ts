import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { BuyerPreference } from '~/composables/useBuyerPreferences';

export interface User {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  createdAt?: string | Date;
}

export const useUserProfileStore = defineStore('userProfile', () => {
  const currentUser = ref<User | null>(null);
  const isAuthenticated = computed(() => !!currentUser.value);
  const userPreferences = ref<BuyerPreference | null>(null);
  const isLoading = ref(false);
  const error = ref<any | null>(null);

  const fullName = computed(() => {
    if (!currentUser.value) return '';
    return `${currentUser.value.firstName || ''} ${currentUser.value.lastName || ''}`.trim();
  });

  const isAdmin = computed(() => currentUser.value?.roles.includes('admin') || false);
  const isBuyer = computed(() => currentUser.value?.roles.includes('buyer') || false);
  const isSeller = computed(() => currentUser.value?.roles.includes('seller') || false);

  function setUser(user: User | null) {
    currentUser.value = user;
    if (!user) {
      userPreferences.value = null;
    }
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading;
  }

  function setError(err: any) {
    error.value = err;
    console.error('UserProfileStore Error:', err);
  }

  async function login(credentials: { email: string; password: string }) {
    setLoading(true);
    setError(null);
    try {
      console.log('Login action in userProfileStore (simulated)', credentials.email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (credentials.email === 'test@example.com' || credentials.email === 'buyer@portfoy.ai') {
        const mockUser: User = {
          id: credentials.email === 'buyer@portfoy.ai' ? 'buyer123' : 'user123',
          email: credentials.email,
          firstName: credentials.email === 'buyer@portfoy.ai' ? 'Alıcı' : 'Test',
          lastName: credentials.email === 'buyer@portfoy.ai' ? 'Profil' : 'Kullanıcısı',
          roles: credentials.email === 'buyer@portfoy.ai' ? ['buyer'] : ['admin'],
          createdAt: new Date(),
        };
        setUser(mockUser);
        if (mockUser.roles.includes('buyer')) {
          await fetchCurrentUserPreferences();
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (e: any) {
      setError(e.message || 'Login failed');
      setUser(null);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    console.log('Logout action in userProfileStore');
    setUser(null);
  }

  function setUserPreferences(preferences: BuyerPreference | null) {
    userPreferences.value = preferences;
  }

  async function fetchCurrentUserPreferences() {
    if (!currentUser.value?.id || !currentUser.value.roles.includes('buyer')) {
      userPreferences.value = null;
      return;
    }
    setLoading(true);
    console.log(`Fetching preferences for user ${currentUser.value.id} (simulated)`);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockPrefs: BuyerPreference = {
        userId: currentUser.value.id,
        location: 'Kadıköy, Beşiktaş',
        minPrice: 1500000,
        maxPrice: 4000000,
        propertyType: 'daire',
        roomCount: '3+1',
      };
      setUserPreferences(mockPrefs);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch preferences');
      setUserPreferences(null);
    } finally {
      setLoading(false);
    }
  }

  return {
    currentUser,
    isAuthenticated,
    userPreferences,
    isLoading,
    error,
    fullName,
    isAdmin,
    isBuyer,
    isSeller,
    setUser,
    login,
    logout,
    setUserPreferences,
    fetchCurrentUserPreferences,
    setLoading,
    setError,
  };
}, {
  persist: true,
}); 