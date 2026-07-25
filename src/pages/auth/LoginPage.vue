<!-- src/pages/auth/LoginPage.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
      <div>
        <h2 class="text-center text-3xl font-bold text-gray-900">Connexion</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Plateforme de gestion des incidents
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" v-model="form.email" type="email" required class="input-field mt-1"
            :class="{ 'border-red-500': errors.email }" placeholder="votre@email.com" />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input id="password" v-model="form.password" type="password" required class="input-field mt-1"
            :class="{ 'border-red-500': errors.password }" placeholder="Votre mot de passe" />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <button type="submit" class="w-full btn-primary py-3" :disabled="loading">
          <LoadingSpinner v-if="loading" :show="true" class="inline h-4 w-4 mr-2" />
          Se connecter
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import { showSuccess, showError } from '@/utils/toast'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({})
const loading = ref(false)

function validateForm() {
  errors.value = {}

  if (!form.value.email.trim()) {
    errors.value.email = 'L\'email est requis'
  }
  if (!form.value.password) {
    errors.value.password = 'Le mot de passe est requis'
  }

  return Object.keys(errors.value).length === 0
}

async function handleLogin() {
  if (!validateForm()) return

  loading.value = true
  try {
    await authStore.login(form.value)
    showSuccess('Connexion réussie')
  }

  catch (error) {
    const message = error.response?.data?.message || 'Erreur de connexion'
    showError(message)
  }
  finally {
    loading.value = false
  }
}
</script>