<script setup lang="ts">
import type { NavMenuItems as NavLink } from '~/types/nav'
import { type SidebarMenuButtonVariants, useSidebar } from '~/components/ui/sidebar'
import { useAuth } from '~/composables/useAuth'

const props = withDefaults(defineProps<{
  item: NavLink
  size?: SidebarMenuButtonVariants['size']
}>(), {
  size: 'default',
})

const auth = useAuth()

// Eğer isMailto özelliği varsa, kullanıcı rolüne göre email adresini belirle
const linkHref = computed(() => {
  if (props.item.isMailto) {
    const email = auth.user?.role === 'ADMIN'
      ? 'hi@emirpeh.com'
      : 'info@portfoyAI.net'
    return `mailto:${email}`
  }
  return props.item.link
})

const { setOpenMobile } = useSidebar()
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton as-child :tooltip="props.item.title" :size="props.size">
        <NuxtLink v-if="!props.item.isMailto" :to="linkHref" :target="props.item.target" @click="setOpenMobile(false)">
          <Icon :name="props.item.icon || ''" mode="svg" />
          <span>{{ props.item.title }}</span>
          <span v-if="props.item.new" class="rounded-md bg-#adfa1d px-1.5 py-0.5 text-xs text-black leading-none no-underline group-hover:no-underline">
            Yeni
          </span>
        </NuxtLink>
        <a v-else :href="linkHref" :target="props.item.target" @click="setOpenMobile(false)">
          <Icon :name="props.item.icon || ''" mode="svg" />
          <span>{{ props.item.title }}</span>
          <span v-if="props.item.new" class="rounded-md bg-#adfa1d px-1.5 py-0.5 text-xs text-black leading-none no-underline group-hover:no-underline">
            Yeni
          </span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<style scoped>

</style>
