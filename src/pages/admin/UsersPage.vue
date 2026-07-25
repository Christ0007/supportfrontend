<!-- src/pages/admin/UsersPage.vue -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
      <button @click="openCreateModal" class="btn-primary">
        Nouvel utilisateur
      </button>
    </div>

    <div class="card">
      <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="search" type="text" placeholder="Rechercher..." class="input-field" @input="debouncedSearch" />
        <select v-model="filters.role" class="input-field" @change="applyFilters">
          <option value="">Tous les rôles</option>
          <option value="admin">Administrateur</option>
          <option value="technician">Technicien</option>
          <option value="company">Entreprise</option>
        </select>
      </div>

      <AppTable :columns="columns" :data="users" :loading="loading">
        <template #cell-name="{ row }">
          <span class="font-medium text-gray-900">
            {{ row.role === 'company' ? (row.company?.company_name || row.name) : row.name }}
          </span>
        </template>
        <template #cell-role="{ value }">
          <StatusBadge :status="value" />
        </template>
        <template #cell-is_active="{ value }">
          <span :class="value ? 'text-green-600' : 'text-red-600'" class="text-sm">
            {{ value ? 'Actif' : 'Inactif' }}
          </span>
        </template>
        <template #actions="{ row }">
          <div class="space-x-2">
            <button @click="openEditModal(row)" class="text-primary-600 hover:text-primary-700 text-sm">
              Modifier
            </button>
            <button v-if="row.is_active" @click="confirmDeactivate(row)"
              class="text-red-600 hover:text-red-700 text-sm">
              Désactiver
            </button>
            <button v-else @click="confirmActivate(row)" class="text-green-600 hover:text-green-700 text-sm">
              Activer
            </button>
          </div>
        </template>
      </AppTable>

      <AppPagination :current-page="pagination.currentPage" :last-page="pagination.lastPage" :total="pagination.total"
        :per-page="pagination.perPage" @page-change="changePage" />
    </div>

    <AppModal :show="showModal" :title="editingUser ? 'Modifier un utilisateur' : 'Nouvel utilisateur'"
      @close="closeModal">
      <UserForm :initial-data="editingUser" :is-editing="!!editingUser" :loading="formLoading" @submit="handleSubmit"
        @cancel="closeModal" />
    </AppModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { userService } from '@/services/userService'
import AppTable from '@/components/common/AppTable.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppModal from '@/components/common/AppModal.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import UserForm from '@/components/forms/UserForm.vue'
import Swal from 'sweetalert2'
import { showSuccess, showError } from '@/utils/toast'

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rôle' },
  { key: 'is_active', label: 'Statut' },
]

const search = ref('')
const { items: users, pagination, loading, filters, changePage, applyFilters, fetchItems } = usePagination(userService.getAll, { role: '' })

const showModal = ref(false)
const editingUser = ref(null)
const formLoading = ref(false)

let searchTimeout

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters({ search: search.value })
  }, 300)
}

function openCreateModal() {
  editingUser.value = null
  showModal.value = true
}

async function openEditModal(user) {
  try {
    editingUser.value = await userService.getById(user.id)
  } catch (error) {
    editingUser.value = user
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingUser.value = null
}

async function handleSubmit(formData) {
  formLoading.value = true
  try {
    if (editingUser.value) {
      await userService.update(editingUser.value.id, formData)
    } else {
      await userService.create(formData)
    }
    showSuccess(`Utilisateur ${editingUser.value ? 'modifié' : 'créé'}`)
    closeModal()
    await fetchItems()
  } catch (error) {
    showError(error.response?.data?.message || 'Une erreur est survenue')
  } finally {
    formLoading.value = false
  }
}

async function confirmDeactivate(user) {
  const result = await Swal.fire({
    title: 'Désactiver l\'utilisateur ?',
    text: `Êtes-vous sûr de vouloir désactiver ${user.name} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, désactiver',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#dc2626'
  })

  if (result.isConfirmed) {
    try {
      await userService.deactivate(user.id)
      await fetchItems()
      showSuccess('Utilisateur désactivé')
    } catch (error) {
      showError('Impossible de désactiver l\'utilisateur')
    }
  }
}

async function confirmActivate(user) {
  const result = await Swal.fire({
    title: 'Réactiver l\'utilisateur ?',
    text: `Êtes-vous sûr de vouloir réactiver ${user.name} ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, réactiver',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#16a34a'
  })

  if (result.isConfirmed) {
    try {
      await userService.activate(user.id)
      await fetchItems()
      showSuccess('Utilisateur réactivé')
    } catch (error) {
      showError('Impossible de réactiver l\'utilisateur')
    }
  }
}

onMounted(() => {
  fetchItems()
})
</script>