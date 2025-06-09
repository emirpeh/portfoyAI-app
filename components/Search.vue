<script setup lang="ts">
import type { NavMenuItems, NavMenu } from '~/types/nav'
import { getFilteredMenu } from '@/constants/menus'
import { useAuth } from '~/composables/useAuth'

const auth = useAuth()

const openCommand = ref(false)
const router = useRouter()

defineShortcuts({
  Meta_K: () => openCommand.value = true,
})

// Kullanıcı rolüne göre filtrelenmiş menüyü al
const filteredMenu = computed(() => {
  return getFilteredMenu(auth.user?.role || null)
})

const componentsNav = computed<NavMenuItems | undefined>(() => {
  return filteredMenu.value
    .flatMap((nav: NavMenu) => nav.items)
    .find((item: NavMenuItems) => item.title === 'Bileşenler')
})

// Tüm menü öğelerini düz bir liste olarak al
const allMenuItems = computed(() => {
  return filteredMenu.value
    .flatMap((nav: NavMenu) => nav.items)
    .filter((item): item is NavMenuItems => 'link' in item)
})

function handleSelectLink(link: string) {
  router.push(link)
  openCommand.value = false
}
</script>

<template>
  <SidebarMenuButton as-child tooltip="Ara" class="block w-full">
    <Button variant="outline" size="sm" class="w-full border-gray-300 bg-white text-xs hover:bg-gray-100" @click="openCommand = !openCommand">
      <Icon name="i-lucide-search" class="mr-2 text-gray-500" />
      <span class="text-gray-700 font-normal group-data-[collapsible=icon]:hidden">Ara</span>
    </Button>
  </SidebarMenuButton>

  <CommandDialog v-model:open="openCommand">
    <CommandInput placeholder="Ara..." />
    <CommandList>
      <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
      <CommandGroup heading="Menü">
        <CommandItem
          v-for="item in allMenuItems"
          :key="item.title"
          :value="item.title"
          @select="() => item.link && handleSelectLink(item.link)"
        >
          <Icon v-if="item.icon" :name="item.icon" class="mr-2 h-4 w-4" />
          {{ item.title }}
          <Badge v-if="item.new" variant="outline" class="ml-2">
            Yeni
          </Badge>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator v-if="componentsNav?.children?.length" />
      <CommandGroup v-if="componentsNav?.children?.length" heading="Bileşenler">
        <CommandItem
          v-for="nav in componentsNav?.children"
          :key="nav.title"
          :value="nav.title"
          class="gap-2"
          @select="() => nav.link && handleSelectLink(nav.link)"
        >
          <Icon name="i-radix-icons-circle" />
          {{ nav.title }}
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>

<style scoped>

</style>
