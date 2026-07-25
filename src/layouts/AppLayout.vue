<template>
<div class="min-h-screen bg-gray-100 overflow-x-hidden" :class="`theme-${sidebarTheme}`">
        <div class="fixed top-0 left-0 right-0 z-50">
      <AppNavbar :is-open="sidebarOpen" :theme="sidebarTheme" @toggle-sidebar="toggleSidebar" />
    </div>

    <div class="flex pt-16">
      <AppSidebar :is-open="sidebarOpen" :menu-items="menuItems" :theme="sidebarTheme" @close-sidebar="sidebarOpen = false" />

      <main class="flex-1 min-w-0 p-6 transition-all duration-300" :class="sidebarOpen ? 'md:ml-64' : 'md:ml-16'">
          <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const authStore = useAuthStore()
const sidebarOpen = ref(true)

onMounted(() => {
  sidebarOpen.value = window.matchMedia('(min-width: 768px)').matches
})

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

const sidebarTheme = computed(() => {
  if (authStore.isAdmin) return 'blue'
  if (authStore.isTechnician) return 'green'
  return 'purple'
})

const menuItems = computed(() => {
  if (authStore.isAdmin) {
    return [
      { path: '/admin/dashboard', name: 'Tableau de bord', icon: 'chart-bar' },
      { path: '/admin/users', name: 'Utilisateurs', icon: 'users' },
      { path: '/admin/solutions', name: 'Solutions', icon: 'cube' },
      { path: '/admin/profile', name: 'Profil', icon: 'users' },
    ]
  } else if (authStore.isTechnician) {
    return [
      { path: '/technician/dashboard', name: 'Tableau de bord', icon: 'chart-bar' },
      { path: '/technician/incidents', name: 'Incidents', icon: 'exclamation-triangle' },
      { path: '/technician/profile', name: 'Profil', icon: 'users' },
    ]
  } else {
    return [
      { path: '/company/dashboard', name: 'Tableau de bord', icon: 'chart-bar' },
      { path: '/company/incidents', name: 'Mes incidents', icon: 'exclamation-triangle' },
      { path: '/company/profile', name: 'Profil', icon: 'users' },
    ]
  }
})
</script>