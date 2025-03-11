<script setup lang="ts">
const props = defineProps<{
  teams: {
    name: string
    logo: string
    plan: string
  }[]
}>()

const activeTeam = ref(props.teams[0])
const localePath = useLocalePath()

// Logo URL kontrolü
const isImageUrl = (url: string) => url.startsWith('/') || url.startsWith('http')

// Ana sayfaya yönlendirme fonksiyonu (dil kontrolü ile)
function goToHome() {
  const homePath = localePath('/')
  return navigateTo(homePath)
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <div class="block w-full cursor-pointer no-underline" @click="goToHome">
        <div class="w-full flex items-center justify-center rounded-md px-3 py-2 hover:bg-sidebar-accent">
          <img
            v-if="isImageUrl(activeTeam.logo)"
            :src="activeTeam.logo"
            :alt="activeTeam.name"
            class="h-12 w-auto"
            loading="eager"
          />
          <Icon v-else :name="activeTeam.logo" class="size-8" />
        </div>
      </div>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<style scoped>

</style>
