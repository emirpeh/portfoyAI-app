<script setup lang="ts">
import type { NavGroup, NavLink, NavMenu } from '~/types/nav'
import { getFilteredMenu } from '@/constants/menus'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/composables/useAuth'

const { t } = useI18n()
const auth = useAuth()

const openCommand = ref(false)
const router = useRouter()

defineShortcuts({
  Meta_K: () => openCommand.value = true,
})

// Kullanıcı rolüne göre filtrelenmiş menüyü al
const filteredMenu = computed(() => {
  return getFilteredMenu(auth.user?.role || null, auth.user?.isDefault || false)
})

const componentsNav = computed<NavGroup | undefined>(() => {
  return filteredMenu.value
    .flatMap((nav: NavMenu) => nav.items)
    // @ts-expect-error - We know that the title is unique
    .find((item: NavGroup) => item.title === 'Components')
})

// Tüm menü öğelerini düz bir liste olarak al
const allMenuItems = computed(() => {
  return filteredMenu.value
    .flatMap((nav: NavMenu) => nav.items)
    .filter((item): item is NavLink => 'link' in item)
})

function handleSelectLink(link: string) {
  router.push(link)
  openCommand.value = false
}
</script>

<template>
  <SidebarMenuButton as-child tooltip="Search" class="block w-full">
    <Button variant="outline" size="sm" class="w-full border-gray-300 bg-white text-xs hover:bg-gray-100" @click="openCommand = !openCommand">
      <Icon name="i-lucide-search" class="mr-2 text-gray-500" />
      <span class="text-gray-700 font-normal group-data-[collapsible=icon]:hidden">{{ t('nav.search') }}</span>
    </Button>
  </SidebarMenuButton>

  <CommandDialog v-model:open="openCommand">
    <CommandInput :placeholder="t('common.placeholder')" />
    <CommandList>
      <CommandEmpty>{{ t('common.no_results') }}</CommandEmpty>
      <CommandGroup :heading="t('common.menu')">
        <CommandItem
          v-for="item in allMenuItems"
          :key="item.title"
          :value="t(item.title)"
          @select="handleSelectLink(item.link)"
        >
          <Icon v-if="item.icon" :name="item.icon" class="mr-2 h-4 w-4" />
          {{ t(item.title) }}
          <Badge v-if="item.new" variant="outline" class="ml-2">
            {{ t('common.new') }}
          </Badge>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator v-if="componentsNav?.children?.length" />
      <CommandGroup v-if="componentsNav?.children?.length" :heading="t('nav.components')">
        <CommandItem
          v-for="nav in componentsNav?.children"
          :key="nav.title"
          :value="nav.title"
          class="gap-2"
          @select="handleSelectLink(nav.link)"
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
