<script setup lang="ts">
const route = useRoute()

function setLinks() {
  if (route.fullPath === '/') {
    return [{ title: 'Ana Sayfa', href: '/' }]
  }
  return route.fullPath.split('/').map((item, index) => {
    const str = item.replace(/-/g, ' ')
    const title = str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    return {
      title: index > 0 ? title : 'Ana Sayfa',
      href: index > 0 ? `/${item}` : '/',
    }
  })
}

const links = ref<{
  title: string
  href: string
}[]>(setLinks())

watch(() => route.fullPath, (val) => {
  if (val) {
    links.value = setLinks()
  }
})
</script>

<template>
  <header class="sticky top-0 z-10 h-53px flex items-center gap-4 border-b px-4 md:px-6" style="background-color: #f5c518;">
    <div class="w-full flex items-center gap-4">
      <SidebarTrigger class="text-black" />
      <Separator orientation="vertical" class="h-4 bg-black" />
      <BaseBreadcrumbCustom :links="links" class="text-black" />
    </div>
    <div class="ml-auto flex items-center gap-2">
      <slot />
    </div>
  </header>
</template>

<style scoped>

</style>
