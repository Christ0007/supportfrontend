<!-- src/pages/admin/SolutionsPage.vue -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Solutions logicielles</h2>
      <button @click="openCreateModal" class="btn-primary">Nouvelle solution</button>
    </div>

    <div class="card">
      <div class="mb-4">
        <input v-model="search" type="text" placeholder="Rechercher..." class="input-field" @input="debouncedSearch" />
      </div>
      <AppTable :columns="columns" :data="solutions" :loading="loading" @sort="handleSort">
          <template #cell-name="{ row }">
          <span class="font-medium text-gray-900">{{ row.name }}</span>
        </template>
        <template #cell-is_active="{ value }">
          <span :class="value ? 'text-green-600' : 'text-red-600'">{{ value ? 'Actif' : 'Inactif' }}</span>
        </template>
        <template #actions="{ row }">
          <button @click="openDetailModal(row)" class="text-gray-600 hover:text-gray-900 text-sm mr-3">Détail</button>
          <button @click="openEditModal(row)" class="text-primary-600 hover:text-primary-700 text-sm">Modifier</button>
        </template>
      </AppTable>
      <AppPagination :current-page="pagination.currentPage" :last-page="pagination.lastPage" :total="pagination.total"
        :per-page="pagination.perPage" @page-change="changePage" />
    </div>

    <!-- Modale de création/modification -->
    <AppModal :show="showEditModal" :title="editingSolution ? 'Modifier une solution' : 'Nouvelle solution'"
      @close="closeEditModal">
      <SoftwareSolutionForm :initial-data="editingSolution" :is-editing="!!editingSolution" :loading="formLoading"
        @submit="handleSubmit" @cancel="closeEditModal" />
    </AppModal>

    <!-- Modale de détail -->
    <AppModal :show="showDetailModal" :title="detailSolution?.name || 'Détail de la solution'"
      @close="closeDetailModal">
      <div v-if="detailLoading" class="text-center py-6">
        <LoadingSpinner :show="true" />
      </div>
      <div v-else-if="detailSolution" class="space-y-5">
        <div>
          <p class="text-sm text-gray-500">Version</p>
          <p class="font-medium">{{ detailSolution.version || '—' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Description</p>
          <p>{{ detailSolution.description || '—' }}</p>
        </div>

        <div>
          <h4 class="font-semibold mb-2">Techniciens référents</h4>
          <div v-if="!detailSolution.technicians?.length" class="text-gray-500 text-sm">Aucun technicien référent</div>
          <ul v-else class="space-y-1">
            <li v-for="tech in detailSolution.technicians" :key="tech.id" class="text-sm">
              {{ tech.name }} <span class="text-gray-500">({{ tech.email }})</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-2">Entreprises utilisatrices</h4>
          <div v-if="!detailSolution.companies?.length" class="text-gray-500 text-sm">Aucune entreprise associée</div>
          <ul v-else class="space-y-1">
            <li v-for="company in detailSolution.companies" :key="company.id" class="text-sm">
              {{ company.company_name }}
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-2">Incidents associés</h4>
          <div v-if="!detailSolution.incidents?.length" class="text-gray-500 text-sm">Aucun incident</div>
          <ul v-else class="space-y-1">
            <li v-for="incident in detailSolution.incidents" :key="incident.id" class="text-sm flex justify-between">
              <span>{{ incident.title }}</span>
              <StatusBadge :status="incident.status" />
            </li>
          </ul>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { solutionService } from '@/services/solutionService'
import AppTable from '@/components/common/AppTable.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppModal from '@/components/common/AppModal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import SoftwareSolutionForm from '@/components/forms/SoftwareSolutionForm.vue'
import Swal from 'sweetalert2'
import { showSuccess, showError } from '@/utils/toast'

const columns = [
  { key: 'id', label: 'N°' },
  { key: 'name', label: 'Nom' },
  { key: 'version', label: 'Version' },
  { key: 'is_active', label: 'Statut' }
]

const search = ref('')
const { items: solutions, pagination, loading, changePage, applyFilters, fetchItems } = usePagination(solutionService.getAll)

const showEditModal = ref(false)
const editingSolution = ref(null)
const formLoading = ref(false)

const showDetailModal = ref(false)
const detailSolution = ref(null)
const detailLoading = ref(false)

let searchTimeout
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => applyFilters({ search: search.value }), 300)
}

function handleSort(dir) {
  applyFilters({ sort_by: 'id', sort_dir: dir })
}

function openCreateModal() {
  editingSolution.value = null
  showEditModal.value = true
}

function openEditModal(row) {
  editingSolution.value = {
    id: row.id,
    name: row.name,
    description: row.description,
    version: row.version,
    technician_ids: row.technicians?.map(t => t.id) || []
  }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingSolution.value = null
}

async function openDetailModal(row) {
  detailSolution.value = null
  showDetailModal.value = true
  detailLoading.value = true
  try {
    detailSolution.value = await solutionService.getById(row.id)
  } catch (error) {
    showError('Impossible de charger le détail de la solution')
    closeDetailModal()
  } finally {
    detailLoading.value = false
  }
}

function closeDetailModal() {
  showDetailModal.value = false
  detailSolution.value = null
}

async function handleSubmit(formData) {
  formLoading.value = true
  try {
    if (editingSolution.value) {
      await solutionService.update(editingSolution.value.id, formData)
    } else {
      await solutionService.create(formData)
    }
    showSuccess(`Solution ${editingSolution.value ? 'modifiée' : 'créée'}`)
    closeEditModal()
    await fetchItems()
  } catch (error) {
    showError(error.response?.data?.message || 'Une erreur est survenue')
  } finally {
    formLoading.value = false
  }
}

onMounted(() => fetchItems())
</script>