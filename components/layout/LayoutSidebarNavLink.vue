<script setup lang="ts">
import type { NavLink } from '~/types/nav'
import { useI18n } from 'vue-i18n'
import { type SidebarMenuButtonVariants, useSidebar } from '~/components/ui/sidebar'
import { useAuth } from '~/composables/useAuth'

const props = withDefaults(defineProps<{
  item: NavLink
  size?: SidebarMenuButtonVariants['size']
}>(), {
  size: 'default',
})

const { t } = useI18n()
const localePath = useLocalePath()
const auth = useAuth()

// Eğer isMailto özelliği varsa, kullanıcı rolüne göre email adresini belirle
const linkHref = computed(() => {
  if (props.item.isMailto) {
    const email = auth.user?.role === 'ADMIN'
      ? 'hi@bulutplus.com'
      : 'info@maxitransport.net'
    return `mailto:${email}`
  }
  // Special handling for home route to prevent double locale prefixing
  if (props.item.link === '/') {
    const { locale } = useI18n()
    return locale.value === 'tr' ? '/' : `/${locale.value}`
  }
  return localePath(props.item.link)
})

const { setOpenMobile } = useSidebar()
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton as-child :tooltip="t(props.item.title)" :size="props.size">
        <NuxtLink v-if="!props.item.isMailto" :to="linkHref" @click="setOpenMobile(false)">
          <Icon :name="props.item.icon || ''" mode="svg" />
          <span>{{ t(props.item.title) }}</span>
          <span v-if="props.item.new" class="rounded-md bg-#adfa1d px-1.5 py-0.5 text-xs text-black leading-none no-underline group-hover:no-underline">
            {{ t('nav.new') }}
          </span>
        </NuxtLink>
        <a v-else :href="linkHref" @click="setOpenMobile(false)">
          <Icon :name="props.item.icon || ''" mode="svg" />
          <span>{{ t(props.item.title) }}</span>
          <span v-if="props.item.new" class="rounded-md bg-#adfa1d px-1.5 py-0.5 text-xs text-black leading-none no-underline group-hover:no-underline">
            {{ t('nav.new') }}
          </span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<style scoped>

</style>
