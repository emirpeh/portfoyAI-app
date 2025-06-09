import { ref, computed } from 'vue';
import type { PropertySearchRequest } from '~/lib/types';

interface BackendResponse {
    data: PropertySearchRequest[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
    };
}

const leadStatuses = [
    { value: 'ACTIVE', label: 'Aktif' },
    { value: 'PENDING_USER_INFO', label: 'Kullanıcı Bilgisi Bekleniyor' },
    { value: 'MATCH_FOUND', label: 'Eşleşme Bulundu' },
    { value: 'CLOSED', label: 'Kapandı' },
    { value: 'CANCELLED', label: 'İptal Edildi' },
];

export const useLeadStatuses = () => ({ leadStatuses });

export function useLeads() {
    const { $apiFetch } = useNuxtApp();

    const leads = ref<PropertySearchRequest[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const total = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);

    async function fetchLeads() {
        loading.value = true;
        error.value = null;
        try {
            const response = await $apiFetch<BackendResponse>('/api/property-search-requests', {
                query: {
                    limit: pageSize.value,
                    offset: (currentPage.value - 1) * pageSize.value,
                },
            });
            leads.value = response.data;
            total.value = response.pagination.total;
        } catch (err: any) {
            console.error('Error fetching leads:', err);
            error.value = err.message || 'Talepler getirilirken bir hata oluştu.';
        } finally {
            loading.value = false;
        }
    }

    async function updateLeadStatus(id: string, status: string) {
        try {
            const updatedLead = await $apiFetch<PropertySearchRequest>(`/api/property-search-requests/${id}`, {
                method: 'PATCH',
                body: { status },
            });

            const index = leads.value.findIndex(l => l.id === id);
            if (index !== -1) {
                leads.value[index].status = updatedLead.status;
            }
        } catch (err: any) {
            console.error(`Error updating lead ${id} status:`, err);
            // Hatanın UI'da gösterilmesi için tekrar fırlatılabilir
            throw err;
        }
    }

    onMounted(fetchLeads);

    return {
        leads,
        loading,
        error,
        total,
        currentPage: computed(() => currentPage.value),
        pageSize,
        fetchLeads,
        updateLeadStatus,
    };
} 