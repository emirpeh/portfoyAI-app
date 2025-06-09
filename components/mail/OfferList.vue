<script lang="ts" setup>
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useOffers } from '@/composables/useOffers'
import { cn } from '@/lib/utils'

const { offers, fetchOffers, total, currentOffset, pageSize } = useOffers()

const selectedOffer = defineModel<number>('selectedOffer', { required: false })

// Fetch offers on component mount
onMounted(() => {
  fetchOffers()
})

function handleOfferClick(offerId: number) {
  selectedOffer.value = offerId
}

function handlePageChange(page: number) {
  // Ensure page is at least 1
  const targetPage = Math.max(1, page)
  // Calculate offset based on page number and page size
  const offset = (targetPage - 1) * pageSize.value
  fetchOffers({ offset, limit: pageSize.value })
}

function getBadgeVariantFromStatus(status: string) {
  switch (status) {
    case 'OFFER_CREATED':
      return 'default'
    case 'OFFER_MISSING_INFORMATION':
      return 'destructive'
    case 'OFFER_RECEIVED':
      return 'secondary'
    case 'NO_SUPPLIER_FOR_OFFER':
      return 'destructive'
    case 'SUPPLIER_WAITING_FOR_OFFER':
      return 'secondary'
    case 'WAITING_FEE_FOR_OFFER':
      return 'outline'
    case 'OFFER_COMPLETED':
      return 'secondary'
    case 'OFFER_CANCELED':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function formatDate(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: tr,
  })
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="h-[calc(100vh-380px)] overflow-y-auto">
      <div class="flex flex-col gap-2 p-4">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold tracking-tight">
              Teklifler
            </h2>
            <p class="text-sm text-muted-foreground">
              Mevcut ve geçmiş tekliflerinizi görüntüleyin.
            </p>
          </div>
        </div>
        <TransitionGroup name="list" appear>
          <div
            v-for="offer in offers"
            :key="offer.id"
            @click="handleOfferClick(offer.id)"
          >
            <div class="flex flex-col items-start gap-2 border rounded-lg p-3 text-left text-sm transition-all hover:bg-accent">
              <div class="w-full flex flex-col gap-1">
                <div class="flex items-center">
                  <div class="flex items-center gap-2">
                    <div class="font-semibold">
                      {{ offer.offerNo }}
                    </div>
                  </div>
                  <div
                    :class="cn(
                      'ml-auto text-xs',
                      selectedOffer === offer.id
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                    )"
                  >
                    {{ formatDate(new Date(offer.createdAt)) }}
                  </div>
                </div>

                <div class="text-xs font-medium">
                  {{ offer.loadCity }} → {{ offer.deliveryCity }}
                </div>
              </div>
              <div class="line-clamp-2 text-xs text-muted-foreground">
                {{ offer.goodsType }} - {{ offer.numOfContainers }}x {{ offer.containerType }}
              </div>
              <div class="flex items-center gap-2">
                <Badge :variant="getBadgeVariantFromStatus(offer.status)">
                  {{ offer.status }}
                </Badge>
                <Badge variant="outline">
                  {{ offer.foreignTrade }}
                </Badge>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <!-- Pagination -->
    <div class="flex-shrink-0 border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="flex justify-center">
        <Pagination>
          <PaginationList>
            <PaginationListItem :value="0">
              <PaginationPrev
                :disabled="currentOffset === 0"
                @click="handlePageChange(1)"
              />
            </PaginationListItem>
            <PaginationListItem v-for="page in Math.ceil(total / pageSize)" :key="page" :value="page">
              <button
                class="rounded-md px-3 py-1"
                :class="Math.floor(currentOffset / pageSize) + 1 === page ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
                @click="handlePageChange(page)"
              >
                {{ page }}
              </button>
            </PaginationListItem>
            <PaginationListItem :value="Math.ceil(total / pageSize) + 1">
              <PaginationNext
                :disabled="currentOffset + pageSize >= total"
                @click="handlePageChange(Math.floor(currentOffset / pageSize) + 2)"
              />
            </PaginationListItem>
          </PaginationList>
        </Pagination>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.list-leave-active {
  position: absolute;
}
</style>
