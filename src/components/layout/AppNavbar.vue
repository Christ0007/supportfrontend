<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
    <div class="flex items-center -ml-4 sm:-ml-6 lg:-ml-8 w-16 justify-center">
          <button @click="$emit('toggle-sidebar')" class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors border-none outline-none focus:outline-none">           
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="iconBg">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
              </svg>
            </div>
          <span v-if="isOpen" class="text-lg font-bold text-gray-900 whitespace-nowrap leading-none">SupportPro</span>          </button>
        </div>

        <div class="flex items-center space-x-4">
          <NotificationBell />

          <div class="relative" ref="userMenuRef">
            <button @click="toggleUserMenu" class="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {{ initials }}
              </div>
              <div class="text-left hidden sm:block">
                <p class="text-sm font-medium leading-tight">{{ authStore.user?.name }}</p>
                <p class="text-xs text-gray-500 leading-tight">{{ roleLabel }}</p>
              </div>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button @click="handleChangePassword" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Changer le mot de passe
              </button>
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AppModal :show="showChangePasswordModal" title="Changer le mot de passe" @close="showChangePasswordModal = false">
      <ChangePasswordForm :loading="changePasswordLoading" @submit="submitChangePassword" @cancel="showChangePasswordModal = false" />
    </AppModal>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import { showSuccess, showError } from '@/utils/toast'
import NotificationBell from './NotificationBell.vue'
import AppModal from '@/components/common/AppModal.vue'
import ChangePasswordForm from '@/components/forms/ChangePasswordForm.vue'
import { authService } from '@/services/authService'

const props = defineProps({
  isOpen: Boolean,
  theme: { type: String, default: 'blue' }
})
defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
const showUserMenu = ref(false)
const userMenuRef = ref(null)

function handleClickOutsideUserMenu(event) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

const showChangePasswordModal = ref(false)
const changePasswordLoading = ref(false)

const iconBg = 'bg-gray-800'

const roleLabels = {
  admin: 'Administrateur',
  technician: 'Technicien',
  company: 'Entreprise cliente'
}

const initials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
})

const roleLabel = computed(() => roleLabels[authStore.user?.role] || '')

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

async function handleLogout() {
  const result = await Swal.fire({
    title: 'Déconnexion',
    text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Annuler'
  })

  if (result.isConfirmed) {
    await authStore.logout()
  }
}

function handleChangePassword() {
  showUserMenu.value = false
  showChangePasswordModal.value = true
}

async function submitChangePassword(passwords) {
  changePasswordLoading.value = true
  try {
    await authService.changePassword(passwords)
    showChangePasswordModal.value = false
    showSuccess('Mot de passe changé avec succès')
  } catch (error) {
    const message = error.response?.data?.message || 'Une erreur est survenue'
    showError(message)
  } finally {
    changePasswordLoading.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutsideUserMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideUserMenu)
})
</script>