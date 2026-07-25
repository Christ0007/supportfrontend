import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  const isLoading = ref(true)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTechnician = computed(() => user.value?.role === 'technician')
  const isCompany = computed(() => user.value?.role === 'company')
  const userRole = computed(() => user.value?.role)

  async function login(credentials) {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      redirectByRole(response.user.role)
      return response
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      router.push('/login')
    }
  }

  async function checkAuth() {
    if (!token.value) {
      isLoading.value = false
      return
    }
    try {
      const response = await authService.getCurrentUser()
      user.value = response
    } catch (error) {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
    } finally {
      isLoading.value = false
    }
  }

  function redirectByRole(role) {
    switch (role) {
      case 'admin': router.push('/admin/dashboard'); break
      case 'technician': router.push('/technician/dashboard'); break
      case 'company': router.push('/company/dashboard'); break
      default: router.push('/login')
    }
  }

  return {
    user, token, loading, isLoading,
    isAuthenticated, isAdmin, isTechnician, isCompany, userRole,
    login, logout, checkAuth, redirectByRole
  }
})