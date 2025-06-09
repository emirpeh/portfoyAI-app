<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowUpRight, Inbox, Users, MoreHorizontal, PlusCircle } from 'lucide-vue-next'
import { format } from 'date-fns'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import BuyerForm from '@/components/forms/BuyerForm.vue'
import SellerForm from '@/components/forms/SellerForm.vue'
import { fetchDashboardData } from '@/lib/api'
import type { Lead, DashboardStats as DashboardStatsType, Property } from '@/lib/types'

definePageMeta({
  layout: 'default',
})

// State for dashboard data
const leads = ref<Lead[]>([])
const stats = ref<DashboardStatsType>({ totalListings: 0, totalCustomers: 0, activeRequests: 0 })
const recentActivities = ref<Property[]>([])
const loading = ref(true)
const router = useRouter()

// State for forms
const isSelectionDialogOpen = ref(false)
const isBuyerFormOpen = ref(false)
const isSellerFormOpen = ref(false)

function onBuyerFormSuccess() {
  isBuyerFormOpen.value = false
  // İsteğe bağlı: Başarı mesajı göster (örn: toast)
}

function onSellerFormSuccess() {
  isSellerFormOpen.value = false
  // İsteğe bağlı: Başarı mesajı göster
}

function openBuyerForm() {
  isBuyerFormOpen.value = true
}

function openSellerForm() {
  isSelectionDialogOpen.value = false
  isSellerFormOpen.value = true
}

// Navigation and data fetching
function navigateToLead(id: string) {
  router.push(`/leads/${id}`)
}

const statusVariant = (status: Lead['status']) => {
  switch (status) {
    case 'ACTIVE': return 'secondary'
    case 'PENDING': return 'outline'
    case 'CLOSED': return 'default'
    case 'REJECTED': return 'destructive'
    default: return 'secondary'
  }
}

async function fetchData() {
  loading.value = true
  try {
    const dashboardData = await fetchDashboardData()
    if (dashboardData) {
      leads.value = dashboardData.leads || []
      stats.value = dashboardData.stats || { totalListings: 0, totalCustomers: 0, activeRequests: 0 }
      recentActivities.value = dashboardData.recentActivities || []
    } else {
      leads.value = []
      stats.value = { totalListings: 0, totalCustomers: 0, activeRequests: 0 }
      recentActivities.value = []
    }
  }
  catch (error) {
    console.error('Error fetching dashboard data:', error)
    leads.value = []
    stats.value = { totalListings: 0, totalCustomers: 0, activeRequests: 0 }
    recentActivities.value = []
  }
  finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    <div class="flex items-center">
      <h1 class="text-lg font-semibold md:text-2xl">Kontrol Paneli</h1>
      <div class="ml-auto flex items-center gap-2">
        <!-- Main Action Button -->
        <Dialog v-model:open="isSelectionDialogOpen">
          <DialogTrigger as-child>
            <Button size="sm" class="h-8 gap-1">
              <PlusCircle class="h-3.5 w-3.5" />
              <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Yeni Talep Ekle</span>
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Yeni Talep Oluştur</DialogTitle>
              <DialogDescription>Eklemek istediğiniz talep türünü seçin.</DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <Button variant="outline" @click="openBuyerForm">Alıcı Talebi Ekle</Button>
              <Button variant="outline" @click="openSellerForm">Satıcı ve Mülk Ekle</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
       <Card>
         <CardHeader class="flex flex-row items-center justify-between pb-2">
           <CardTitle class="text-sm font-medium">Toplam İlanlar</CardTitle>
           <Inbox class="h-4 w-4 text-muted-foreground" />
         </CardHeader>
         <CardContent>
           <div class="text-2xl font-bold">{{ stats.totalListings }}</div>
           <p class="text-xs text-muted-foreground">Sistemdeki toplam ilan sayısı</p>
         </CardContent>
       </Card>
       <Card>
         <CardHeader class="flex flex-row items-center justify-between pb-2">
           <CardTitle class="text-sm font-medium">Aktif Talepler</CardTitle>
           <ArrowUpRight class="h-4 w-4 text-muted-foreground" />
         </CardHeader>
         <CardContent>
           <div class="text-2xl font-bold">{{ stats.activeRequests }}</div>
           <p class="text-xs text-muted-foreground">Şu anda aktif olan talep sayısı</p>
         </CardContent>
       </Card>
       <Card>
         <CardHeader class="flex flex-row items-center justify-between pb-2">
           <CardTitle class="text-sm font-medium">Toplam Müşteriler</CardTitle>
           <Users class="h-4 w-4 text-muted-foreground" />
         </CardHeader>
         <CardContent>
           <div class="text-2xl font-bold">{{ stats.totalCustomers }}</div>
           <p class="text-xs text-muted-foreground">Sistemdeki toplam müşteri sayısı</p>
         </CardContent>
       </Card>
    </div>

    <!-- Recent Leads Table -->
    <Card>
       <CardHeader>
         <CardTitle>Son Talepler</CardTitle>
         <CardDescription>En son gelen talepleri ve durumlarını buradan yönetebilirsiniz.</CardDescription>
       </CardHeader>
       <CardContent>
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>Müşteri</TableHead>
               <TableHead>Talep Notu</TableHead>
               <TableHead>Durum</TableHead>
               <TableHead class="text-right">Tarih</TableHead>
               <TableHead><span class="sr-only">Eylemler</span></TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             <template v-if="loading">
               <TableRow>
                 <TableCell colspan="5" class="text-center">Yükleniyor...</TableCell>
               </TableRow>
             </template>
             <template v-else-if="leads.length > 0">
               <TableRow v-for="lead in leads" :key="lead.id">
                 <TableCell>
                   <div class="font-medium">{{ lead.customer.name }}</div>
                   <div class="text-sm text-muted-foreground">{{ lead.customer.email }}</div>
                 </TableCell>
                 <TableCell>{{ lead.mailLogs && lead.mailLogs[0] ? lead.mailLogs[0].contentTitle : 'Başlıksız Talep' }}</TableCell>
                 <TableCell>
                   <Badge :variant="statusVariant(lead.status)">{{ lead.status }}</Badge>
                 </TableCell>
                 <TableCell class="text-right">{{ format(new Date(lead.createdAt), 'dd.MM.yyyy') }}</TableCell>
                 <TableCell class="text-right">
                    <DropdownMenu>
                     <DropdownMenuTrigger as-child>
                       <Button aria-haspopup="true" size="icon" variant="ghost">
                         <MoreHorizontal class="h-4 w-4" />
                         <span class="sr-only">Menüyü aç</span>
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                       <DropdownMenuLabel>Eylemler</DropdownMenuLabel>
                       <DropdownMenuItem @click="navigateToLead(lead.id)">Detayları Görüntüle</DropdownMenuItem>
                       <DropdownMenuItem>Müşteriye Ulaş</DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </TableCell>
               </TableRow>
             </template>
             <template v-else>
                <TableRow>
                 <TableCell colspan="5" class="text-center">Henüz gösterilecek bir talep yok.</TableCell>
               </TableRow>
             </template>
           </TableBody>
         </Table>
       </CardContent>
     </Card>

    <!-- Recent Activities Table -->
    <Card>
       <CardHeader>
         <CardTitle>Son Aktiviteler</CardTitle>
         <CardDescription>En son satılan veya kiralanan mülkler.</CardDescription>
       </CardHeader>
       <CardContent>
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>İlan</TableHead>
               <TableHead>Durum</TableHead>
               <TableHead>Fiyat</TableHead>
               <TableHead class="text-right">Tarih</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             <template v-if="loading">
               <TableRow>
                 <TableCell colspan="4" class="text-center">Yükleniyor...</TableCell>
               </TableRow>
             </template>
             <template v-else-if="recentActivities.length > 0">
               <TableRow v-for="activity in recentActivities" :key="activity.id">
                 <TableCell>
                   <div class="font-medium">{{ activity.title }}</div>
                   <div class="text-sm text-muted-foreground">{{ activity.listingNo }}</div>
                 </TableCell>
                 <TableCell>
                   <Badge :variant="activity.status === 'SOLD' ? 'destructive' : 'default'">{{ activity.status === 'SOLD' ? 'Satıldı' : 'Kiralandı' }}</Badge>
                 </TableCell>
                 <TableCell>{{ new Intl.NumberFormat('tr-TR', { style: 'currency', currency: activity.currency }).format(activity.price) }}</TableCell>
                 <TableCell class="text-right">{{ format(new Date(activity.updatedAt), 'dd.MM.yyyy') }}</TableCell>
               </TableRow>
             </template>
             <template v-else>
                <TableRow>
                 <TableCell colspan="4" class="text-center">Henüz gösterilecek bir aktivite yok.</TableCell>
               </TableRow>
             </template>
           </TableBody>
         </Table>
       </CardContent>
     </Card>

    <!-- Form Modals -->
    <Dialog v-model:open="isBuyerFormOpen">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Yeni Alıcı Talebi Oluştur</DialogTitle>
          <DialogDescription>
            Manuel olarak yeni bir alıcı talebi ekleyin. Gerekli tüm alanları doldurun.
          </DialogDescription>
        </DialogHeader>
        <BuyerForm @success="onBuyerFormSuccess" />
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="isSellerFormOpen">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Yeni Satıcı/İlan Oluştur</DialogTitle>
          <DialogDescription>
            Manuel olarak yeni bir satıcı veya ilan ekleyin.
          </DialogDescription>
        </DialogHeader>
        <SellerForm @success="onSellerFormSuccess" />
      </DialogContent>
    </Dialog>
  </main>
</template>
