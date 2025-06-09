import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export function useDateFormat() {
  const formatRelativeDate = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: tr,
    })
  }

  return {
    formatRelativeDate,
  }
}
