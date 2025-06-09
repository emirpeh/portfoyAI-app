<script setup lang="ts">
const isDesktop = useMediaQuery('(min-width: 768px)')

const isOpen = ref(false)

const { sidebar } = useAppSettings()

const direction = useTextDirection()

function handleChangeDirection(dir: 'ltr' | 'rtl') {
  direction.value = dir
  sidebar.value.side = dir === 'rtl' ? 'right' : 'left'
}
</script>

<template>
  <Sheet v-if="isDesktop" v-model:open="isOpen">
    <SheetTrigger as-child>
      <Button class="fixed top-1/2 z-50" :class="direction === 'rtl' ? '-left-3 pl-6' : '-right-3 pr-6'">
        <Icon name="i-lucide-settings" class="animate-spin-slow" size="18" />
      </Button>
    </SheetTrigger>
    <SheetContent :side="direction === 'rtl' ? 'left' : 'right'">
      <SheetHeader>
        <SheetTitle>Tema Ayarları</SheetTitle>
        <SheetDescription>Gerçek Zamanlı Olarak Özelleştir ve Önizle</SheetDescription>
      </SheetHeader>
      <div class="mt-4 flex flex-col gap-6">
        <div class="space-y-3">
          <Badge>Temalar</Badge>
          <ThemeCustomize />
        </div>
        <Separator />
        <div class="space-y-3">
          <Badge>Yerleşim</Badge>
          <div class="space-y-1.5">
            <Label>Navigasyon Tipi</Label>
            <div class="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                :class="{ 'border-primary border-2': sidebar.variant === 'sidebar' }"
                @click="sidebar.variant = 'sidebar'"
              >
                Sidebar
              </Button>
              <Button
                variant="outline"
                :class="{ 'border-primary border-2': sidebar.variant === 'floating' }"
                @click="sidebar.variant = 'floating'"
              >
                Floating
              </Button>
              <Button
                variant="outline"
                :class="{ 'border-primary border-2': sidebar.variant === 'inset' }"
                @click="sidebar.variant = 'inset'"
              >
                Inset
              </Button>
            </div>
          </div>
          <div class="space-y-1.5">
            <Label>Yön</Label>
            <div class="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                :class="{ 'border-primary border-2': direction === 'ltr' }"
                @click="handleChangeDirection('ltr')"
              >
                LTR
              </Button>
              <Button
                variant="outline"
                :class="{ 'border-primary border-2': direction === 'rtl' }"
                @click="handleChangeDirection('rtl')"
              >
                RTL
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>

  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger as-child>
      <Button class="fixed top-1/2 z-50 pr-6 -right-3">
        <Icon name="i-lucide-settings" class="animate-spin-slow" size="18" />
      </Button>
    </DrawerTrigger>
    <DrawerContent class="max-h-[97%]">
      <DrawerHeader class="text-center sm:text-center">
        <DrawerTitle>Tema Ayarları</DrawerTitle>
        <DrawerDescription>Gerçek Zamanlı Olarak Özelleştir ve Önizle</DrawerDescription>
      </DrawerHeader>
      <div class="mx-auto max-w-md w-full overflow-auto overflow-y-auto px-4 pb-6 space-y-6">
        <div class="space-y-3">
          <Badge>Temalar</Badge>
          <ThemeCustomize />
        </div>
        <Separator />
        <div class="space-y-3">
          <Badge>Yerleşim</Badge>
          <div class="space-y-1.5">
            <Label>Navigasyon Tipi</Label>
            <div class="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                :class="{ 'border-primary border-2': sidebar.variant === 'sidebar' }"
                @click="sidebar.variant = 'sidebar'"
              >
                Sidebar
              </Button>
              <Button
                variant="outline"
                :class="{ 'border-primary border-2': sidebar.variant === 'floating' }"
                @click="sidebar.variant = 'floating'"
              >
                Floating
              </Button>
              <Button
                variant="outline"
                :class="{ 'border-primary border-2': sidebar.variant === 'inset' }"
                @click="sidebar.variant = 'inset'"
              >
                Inset
              </Button>
            </div>
          </div>
          <div class="space-y-1.5">
            <Label>Yön</Label>
            <div class="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                :class="{ 'border-primary border-2': direction === 'ltr' }"
                @click="handleChangeDirection('ltr')"
              >
                LTR
              </Button>
              <Button
                variant="outline"
                :class="{ 'border-primary border-2': direction === 'rtl' }"
                @click="handleChangeDirection('rtl')"
              >
                RTL
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</template>

<style scoped>

</style>
