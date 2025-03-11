export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      auth: {
        login: 'Login',
        description: 'Enter your email and password to login',
        failed: 'Invalid credentials',
        error: 'An error occurred',
        slogan: 'Systematic cargo operation and intensive flight support with air transportation services solutions from all over the world, airport or door delivery.',
        companyName: 'Maxi Logistics',
      },
      language_switcher: {
        switch: 'Change Language',
      },
    },
    tr: {
      auth: {
        login: 'Giriş Yap',
        description: 'Giriş yapmak için e-posta ve şifrenizi girin',
        failed: 'Geçersiz kimlik bilgileri',
        error: 'Bir hata oluştu',
        slogan: 'Sistemli kargo operasyonu ve yoğun uçuş desteği ile dünyanın her yerinden, havalimanı ya da kapı teslimli havayolu taşımacılığı hizmetleri çözümleri.',
        companyName: 'Maxi Lojistik',
      },
      language_switcher: {
        switch: 'Dil Değiştir',
      },
    },
  },
}))
