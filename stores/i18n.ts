export const useI18nStore = defineStore('i18n', {
  state: () => ({
    locale: 'tr',
  }),
  actions: {
    setLocale(newLocale: 'en' | 'tr') {
      this.locale = newLocale
    },
  },
  persist: true,
})
