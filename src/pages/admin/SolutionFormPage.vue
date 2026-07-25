<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Modifier' : 'Créer' }} une solution</h2>
    <div class="card">
      <SoftwareSolutionForm :initial-data="solution" :is-editing="isEditing" :loading="loading" @submit="handleSubmit"
        @cancel="$router.back()" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { solutionService } from '@/services/solutionService'
import SoftwareSolutionForm from '@/components/forms/SoftwareSolutionForm.vue'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const solution = ref(null)
const isEditing = computed(() => route.params.id !== undefined)

onMounted(async () => {
  if (isEditing.value) {
    try {
      const data = await solutionService.getById(route.params.id)
      solution.value = {
        name: data.name,
        description: data.description,
        version: data.version,
        technician_ids: data.technicians?.map(t => t.id) || []
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Solution introuvable' })
      router.back()
    }
  }
})

async function handleSubmit(formData) {
  loading.value = true
  try {
    if (isEditing.value) {
      await solutionService.update(route.params.id, formData)
    } else {
      await solutionService.create(formData)
    }
    Swal.fire({ icon: 'success', title: `Solution ${isEditing.value ? 'modifiée' : 'créée'}`, timer: 1500, showConfirmButton: false })
    router.push('/admin/solutions')
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Erreur', text: error.response?.data?.message || 'Une erreur est survenue' })
  } finally {
    loading.value = false
  }
}
</script>