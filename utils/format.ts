export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`
}

export function formatDate(date: string | Date): string {
  if (!date)
    return ''
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
