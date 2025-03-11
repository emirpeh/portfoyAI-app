import { useSwitchLocalePath } from '#i18n'

export function useLanguage() {
  const { locale } = useI18n()
  const i18n = useI18n()
  const i18nStore = useI18nStore()
  const router = useRouter()
  const switchLocalePath = useSwitchLocalePath()
  const nuxtApp = useNuxtApp()

  async function setLanguage(lang: 'en' | 'tr') {
    // Vue I18n locale'ini güncelle
    i18n.locale.value = lang

    // Store'u güncelle
    i18nStore.setLocale(lang)

    // Cookie'yi güncelle
    const cookie = useCookie('i18n_redirected', {
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    })
    cookie.value = lang

    // URL'yi güncelle (sayfayı yenilemeden)
    const newPath = switchLocalePath(lang)
    if (newPath && router.currentRoute.value.path !== newPath) {
      await router.push(newPath)
    }

    // Tüm bileşenlerin yeniden render edilmesini sağla
    nuxtApp.hook('i18n:localeSwitched', () => {
      // Dil değiştirildi
    })
  }

  return {
    setLanguage,
    currentLanguage: locale,
  }
}
