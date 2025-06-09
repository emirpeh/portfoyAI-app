<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { getFilteredMenu, navMenuBottom } from '~/constants/menus'
import type { NavMenuItems } from '~/types/nav'
import type { AuthUser } from '~/composables/useAuth'

const auth = useAuth()

// Kullanıcı profil bilgilerini al
const userProfile = ref<AuthUser | null>(auth.user)

// Kullanıcı rolüne göre filtrelenmiş menüyü al
const filteredNavMenu = computed(() => {
  if (!userProfile.value)
    return []
  return getFilteredMenu(userProfile.value.role)
})

// Kullanıcı giriş yaptığında profil bilgilerini güncelle
onMounted(async () => {
  if (auth.accessToken && !userProfile.value) {
    try {
      const userData = await auth.fetchUser()
      userProfile.value = userData || null
    }
    catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }
})

function resolveNavItemComponent(item: NavMenuItems): any {
  if ('children' in item && item.children)
    return resolveComponent('LayoutSidebarNavGroup')

  return resolveComponent('LayoutSidebarNavLink')
}

const teams: {
  name: string
  logo: string
  plan: string
}[] = [
  {
    name: '',
    logo: '/images/logo-portfoyai.svg',
    plan: '',
  },
]

// Kullanıcı bilgilerini auth'dan al
const user = computed(() => {
  // Kullanıcı rolüne göre farklı mail adresleri
  const supportEmail = auth.user?.role === 'ADMIN'
    ? 'hi@bulutplus.com'
    : 'info@maxitransport.net'

  return {
    name: auth.user?.role || 'Kullanıcı',
    email: auth.user?.email || '',
    avatar: '/images/icon.jpeg',
    supportEmail,
  }
})

const { sidebar } = useAppSettings()
</script>

<template>
  <SidebarProvider>
    <Sidebar :collapsible="sidebar.collapsible" :side="sidebar.side" :variant="sidebar.variant">
      <SidebarHeader>
        <LayoutSidebarNavHeader :teams="teams" />
        <Search />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup v-for="(nav, indexGroup) in filteredNavMenu" :key="indexGroup">
          <SidebarGroupLabel v-if="nav.heading">
            {{ nav.heading }}
          </SidebarGroupLabel>
          <component
            :is="resolveNavItemComponent(item)"
            v-for="(item, index) in nav.items"
            :key="index"
            :item="item"
          />
        </SidebarGroup>
        <SidebarGroup class="mt-auto">
          <component
            :is="resolveNavItemComponent(item)"
            v-for="(item, index) in navMenuBottom"
            :key="index"
            :item="item"
            size="sm"
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LayoutSidebarNavFooter :user="user" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  </SidebarProvider>
</template>

<style scoped>

</style>
