<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Déclarer un incident</h2>
    <div class="card">
      <IncidentForm :available-solutions="availableSolutions" :loading="loading" @submit="handleSubmit"
        @cancel="$router.back()" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { incidentService } from '@/services/incidentService'
import IncidentForm from '@/components/forms/IncidentForm.vue'
import Swal from 'sweetalert2'
import { showSuccess, showError } from '@/utils/toast'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const availableSolutions = ref([])

onMounted(() => {
  availableSolutions.value = authStore.user?.company?.software_solutions || []
  console.log('User:', authStore.user)
  console.log('Company:', authStore.user?.company)
  console.log('Solutions:', authStore.user?.company?.software_solutions)
})

async function handleSubmit(formData) {
  loading.value = true
  try {
    await incidentService.create(formData)
    showSuccess('Incident déclaré')
    router.push('/company/incidents')
  } catch (error) {
    showError(error.response?.data?.message || 'Une erreur est survenue')
  } finally {
    loading.value = false
  }
}
</script>