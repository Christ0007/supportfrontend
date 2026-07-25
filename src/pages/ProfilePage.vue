<template>
  <div class="space-y-6 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-900">Profil</h2>

    <div class="card">
      <h3 class="text-lg font-semibold mb-4">Informations du compte</h3>
      <div class="space-y-3">
        <div>
          <p class="text-sm text-gray-500">Nom</p>
          <p class="font-medium">{{ authStore.user?.name }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Email</p>
          <p class="font-medium">{{ authStore.user?.email }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Rôle</p>
          <StatusBadge :status="authStore.user?.role" />
        </div>
        <div v-if="authStore.user?.company">
          <p class="text-sm text-gray-500">Entreprise</p>
          <p class="font-medium">{{ authStore.user.company.company_name }}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 class="text-lg font-semibold mb-4">Changer le mot de passe</h3>
      <ChangePasswordForm :loading="loading" @submit="submitChangePassword" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ChangePasswordForm from '@/components/forms/ChangePasswordForm.vue'
import Swal from 'sweetalert2'
import { showSuccess, showError } from '@/utils/toast'

const authStore = useAuthStore()
const loading = ref(false)

async function submitChangePassword(passwords) {
  loading.value = true
  try {
    await authService.changePassword(passwords)
    showSuccess('Mot de passe changé avec succès')
  } catch (error) {
    const message = error.response?.data?.message || 'Une erreur est survenue'
    showError(message)
  } finally {
    loading.value = false
  }
}
</script>