export const useI18nStore = defineStore('i18n', {
  state: () => ({
    locale: 'en',
  }),
  actions: {
    setLocale(newLocale: 'en' | 'tr') {
      this.locale = newLocale
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
