// src/stores/ui.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const loading = ref(false)

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setLoading(value) {
    loading.value = value
  }

  return {
    sidebarOpen,
    loading,
    toggleSidebar,
    setLoading
  }
})