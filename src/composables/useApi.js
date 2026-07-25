// src/composables/useApi.js
import { ref } from 'vue'
import Swal from 'sweetalert2'

export function useApi(apiFunction) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function execute(...args) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiFunction(...args)
      data.value = response
      return response
    } catch (err) {
      error.value = err
      const message = err.response?.data?.message || 'Une erreur est survenue'
      
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: message,
      })
      
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    execute
  }
}