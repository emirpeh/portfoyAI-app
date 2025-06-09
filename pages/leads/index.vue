<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLeads, useLeadStatuses } from '@/composables/useLeads'

const { leads, loading, error, updateLeadStatus } = useLeads()
const { leadStatuses } = useLeadStatuses()
const router = useRouter()

function navigateToLead(id: string) {
  router.push(`/leads/${id}`)
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getInitial = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
}

const parseLocations = (locations: any) => {
  try {
    if (!locations) return 'Belirtilmemiş';
    const parsed = typeof locations === 'string' ? JSON.parse(locations) : locations;
    if (Array.isArray(parsed)) {
      return parsed.join(', ');
    }
    return 'Geçersiz Lokasyon';
  } catch (e) {
    return 'Hatalı Lokasyon Formatı';
  }
};

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'ACTIVE':
    case 'MATCH_FOUND':
      return 'default' // veya 'outline'
    case 'CLOSED':
    case 'CANCELLED':
      return 'destructive'
    case 'PENDING_USER_INFO':
      return 'secondary'
    default:
      return 'secondary'
  }
}
</script>

<template>
  <div class="p-4 md:p-6">
    <Card>
      <CardHeader>
        <CardTitle>Gelen Talepler</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-16">
          <p>Yükleniyor...</p>
        </div>

        <div v-else-if="error" class="text-red-500 py-16 text-center">
          <p>Veriler yüklenirken bir hata oluştu.</p>
          <p class="text-sm text-gray-500">{{ error }}</p>
        </div>

        <div v-else>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Müşteri</TableHead>
                <TableHead>Talep Özeti</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead class="text-right">Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="lead in leads" :key="lead.id">
                <TableCell @click="navigateToLead(lead.id)" class="cursor-pointer">
                  <div class="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{{ getInitial(lead.customer?.name ?? '') }}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div class="font-medium">{{ lead.customer?.name || 'İsimsiz' }}</div>
                      <div class="text-sm text-muted-foreground">{{ lead.customer?.email || '' }}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell @click="navigateToLead(lead.id)" class="cursor-pointer">
                  <div class="font-medium">
                    {{ lead.transactionType === 'SALE' ? 'Satılık Talep' : 'Kiralık Talep' }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    <span v-if="lead.locations">{{ parseLocations(lead.locations) }}</span>
                    <span v-if="lead.minRooms || lead.maxRooms"> | {{ lead.minRooms || '?' }}-{{ lead.maxRooms || '?' }} oda</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" class="p-0 h-auto">
                        <Badge :variant="getStatusVariant(lead.status)" class="cursor-pointer">
                          {{ lead.status }}
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Durumu Değiştir</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem v-for="s in leadStatuses" :key="s.value" @click="updateLeadStatus(lead.id, s.value)">
                        <span>{{ s.label }}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell @click="navigateToLead(lead.id)" class="text-right cursor-pointer">
                  {{ formatDate(lead.createdAt) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template> 