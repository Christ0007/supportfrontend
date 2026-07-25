import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()

  return {
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    isTechnician: computed(() => authStore.isTechnician),
    isCompany: computed(() => authStore.isCompany),
    login: authStore.login,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth
  }
}