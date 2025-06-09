<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const route = useRoute()
const leadId = route.params.id as string

interface MailLog {
  id: string;
  from: string;
  to: string;
  contentTitle: string;
  contentBody: string;
  createdAt: string;
  parsedData: any;
}

interface Lead {
  id: string;
  requestNo: string;
  status: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  mailLogs: MailLog[];
  locations: any;
  minPrice: number;
  maxPrice: number;
  minRooms: number;
  maxRooms: number;
  notes?: string;
}

const lead = ref<Lead | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchLeadDetails() {
  loading.value = true
  error.value = null
  try {
    const response = await fetch(`/api/leads/${leadId}`)
    if (!response.ok) {
      throw new Error('Talep detayları yüklenemedi.')
    }
    lead.value = await response.json()
  }
  catch (e: any) {
    error.value = e.message
  }
  finally {
    loading.value = false
  }
}

onMounted(fetchLeadDetails)

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getInitial = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
}

const parseJsonData = (data: any) => {
  if (!data) return null;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return null;
  }
};
</script>

<template>
  <div class="p-4 md:p-6">
    <div v-if="loading" class="text-center">
      <p>Yükleniyor...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="lead" class="grid gap-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">
          Talep Detayı: #{{ lead.requestNo }}
        </h1>
        <Badge :variant="lead.status === 'ACTIVE' ? 'default' : 'secondary'">
          {{ lead.status }}
        </Badge>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <!-- Sol Sütun: Talep ve Müşteri Bilgileri -->
        <div class="md:col-span-2 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Talep Özeti</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Oluşturulma Tarihi</span>
                <span>{{ formatDate(lead.createdAt) }}</span>
              </div>
              <div v-if="lead.minRooms || lead.maxRooms" class="flex justify-between">
                <span class="text-muted-foreground">Oda Sayısı Aralığı</span>
                <span>{{ lead.minRooms || '?' }} - {{ lead.maxRooms || '?' }}</span>
              </div>
              <div v-if="lead.minPrice || lead.maxPrice" class="flex justify-between">
                <span class="text-muted-foreground">Fiyat Aralığı</span>
                <span>{{ lead.minPrice?.toLocaleString() || '?' }} - {{ lead.maxPrice?.toLocaleString() || '?' }} TRY</span>
              </div>
              <div v-if="lead.locations" class="flex justify-between">
                <span class="text-muted-foreground">İstenen Lokasyonlar</span>
                <div class="flex flex-wrap gap-1 justify-end">
                   <Badge v-for="loc in parseJsonData(lead.locations)" :key="loc" variant="outline">{{ loc }}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Müşteri Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
               <div class="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{{ getInitial(lead.customer.name) }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="font-semibold">{{ lead.customer.name }}</div>
                    <a :href="`mailto:${lead.customer.email}`" class="text-sm text-muted-foreground hover:underline">{{ lead.customer.email }}</a>
                     <div v-if="lead.customer.phone" class="text-sm text-muted-foreground">{{ lead.customer.phone }}</div>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sağ Sütun: E-posta Geçmişi -->
        <div class="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>İletişim Geçmişi</CardTitle>
              <CardDescription>Bu talebe ilişkin tüm e-postalar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible class="w-full">
                <AccordionItem v-for="log in lead.mailLogs" :key="log.id" :value="log.id">
                  <AccordionTrigger>
                    <div class="flex flex-col items-start text-left">
                       <span class="font-semibold">{{ log.contentTitle || 'Başlıksız E-posta' }}</span>
                       <span class="text-xs text-muted-foreground">{{ formatDate(log.createdAt) }}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div class="prose max-w-none text-sm" v-html="log.contentBody?.replace(/\n/g, '<br />')"></div>
                     <div v-if="parseJsonData(log.parsedData)" class="mt-4">
                        <h4 class="font-semibold mb-2">Yapay Zeka Analizi:</h4>
                        <pre class="text-xs bg-gray-100 p-2 rounded-md overflow-auto">{{ JSON.stringify(parseJsonData(log.parsedData), null, 2) }}</pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <p>Talep bulunamadı.</p>
    </div>
  </div>
</template> 