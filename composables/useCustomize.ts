import { type Theme, themes } from '@/lib/registry/themes'

interface Config {
  theme?: Theme['name']
  radius: number
}

export function useCustomize() {
  const colorMode = useColorMode()

  // Null check ekle
  if (!colorMode?.value) {
    return {
      theme: ref('light'),
      radius: ref(0),
    }
  }

  const isDark = colorMode.value === 'yellow'
  const config = useCookie<Config>('config', {
    default: () => ({
      theme: 'yellow',
      radius: 0,
    }),
  })

  const themeClass = computed(() => `theme-${config.value.theme}`)

  const theme = ref(config.value.theme)
  const radius = ref(config.value.radius)

  function setTheme(themeName: Theme['name']) {
    config.value.theme = themeName
    theme.value = themeName
  }

  function setRadius(newRadius: number) {
    config.value.radius = newRadius
    radius.value = newRadius
  }

  const themePrimary = computed(() => {
    const t = themes.find(t => t.name === theme.value)
    return `hsl(${
      t?.cssVars[isDark ? 'dark' : 'light'].primary
    })`
  })

  return {
    themeClass,
    theme,
    setTheme,
    radius,
    setRadius,
    themePrimary,
  }
}
