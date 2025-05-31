import { en, tr } from 'vuetify/locale'
import enLocale from './lang/locales/en.json'
import trLocale from './lang/locales/tr.json'

const config = {
  legacy: false,
  locale: 'tr',
  fallbackLocale: 'tr',
  messages: {
    en: {
      $vuetify: {
        ...en,
      },
      ...enLocale,
    },
    tr: {
      $vuetify: {
        ...tr,
      },
      ...trLocale,
    },
  },
}
export { config }
export default defineI18nConfig(() => config)
