import type { AppConfigInput } from 'nuxt/schema'

export function useAppSettings() {
  const { sidebar: _sidebar } = useAppConfig()

  const sidebarConfig = useCookie('app-settings', {
    default: () => ({
      collapsible: _sidebar.collapsible,
      side: _sidebar.side,
      variant: _sidebar.variant,
    }) as AppConfigInput['sidebar'],
  })

  const sidebar = ref(sidebarConfig.value)

  watch(sidebar, (newValue) => {
    sidebarConfig.value = newValue
  })

  return {
    sidebar,
  }
}
