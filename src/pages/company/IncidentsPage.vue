<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Mes incidents</h2>
      <router-link to="/company/incidents/create" class="btn-primary">Déclarer un incident</router-link>
    </div>

    <div class="card">
      <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="search" type="text" placeholder="Rechercher..." class="input-field" @input="debouncedSearch" />
        <select v-model="filters.status" class="input-field" @change="applyFilters({ status: filters.status })">
          <option value="">Tous les statuts</option>
          <option value="declared">Déclaré</option>
          <option value="analyzed">Analysé</option>
          <option value="taken_over">Pris en charge</option>
          <option value="in_progress">En traitement</option>
          <option value="resolved">Résolu</option>
          <option value="closed">Clôturé</option>
        </select>
        <select v-model="filters.priority" class="input-field" @change="applyFilters({ priority: filters.priority })">
          <option value="">Toutes les priorités</option>
          <option value="low">Basse</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
          <option value="critical">Critique</option>
        </select>
      </div>

      <AppTable :columns="columns" :data="incidents" :loading="loading" @sort="handleSort">
          <template #cell-title="{ row }">
          <router-link :to="`/company/incidents/${row.id}`" class="font-medium text-primary-600 hover:text-primary-700">
            {{ row.title }}
          </router-link>
        </template>
        <template #cell-software_solution="{ row }">
          {{ row.software_solution?.name }}
        </template>
        <template #cell-company="{ row }">
          {{ row.company?.company_name }}
        </template>
        <template #cell-created_at="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell-priority="{ value }">
          <StatusBadge :status="value" />
        </template>
        <template #cell-status="{ value }">
          <StatusBadge :status="value" />
        </template>
        <template #actions="{ row }">
          <router-link :to="`/company/incidents/${row.id}`"
            class="text-primary-600 hover:text-primary-700 text-sm">Détails</router-link>
        </template>
      </AppTable>

      <AppPagination :current-page="pagination.currentPage" :last-page="pagination.lastPage" :total="pagination.total"
        :per-page="pagination.perPage" @page-change="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { incidentService } from '@/services/incidentService'
import AppTable from '@/components/common/AppTable.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { formatDate } from '@/utils/formatters'

const columns = [
  { key: 'id', label: 'N°' },
  { key: 'title', label: 'Titre' },
  { key: 'software_solution', label: 'Solution' },
  { key: 'priority', label: 'Priorité' },
  { key: 'status', label: 'Statut' },
  { key: 'created_at', label: 'Date' }
]

const search = ref('')
const { items: incidents, pagination, loading, filters, changePage, applyFilters, fetchItems } = usePagination(incidentService.getAll, { status: '', priority: '' })

let searchTimeout
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => applyFilters({ search: search.value }), 300)
}

function handleSort(dir) {
  applyFilters({ sort_by: 'id', sort_dir: dir })
}

onMounted(() => fetchItems())
</script>