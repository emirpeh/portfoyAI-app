import { formatDistanceToNow } from 'date-fns'
import { enUS, tr } from 'date-fns/locale'
import { useI18n } from 'vue-i18n'

export function useDateFormat() {
  const { locale } = useI18n()

  const formatRelativeDate = (date: string) => {
    const localeMap = {
      en: enUS,
      tr,
    }

    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: localeMap[locale.value as keyof typeof localeMap],
    })
  }

  return {
    formatRelativeDate,
  }
}
