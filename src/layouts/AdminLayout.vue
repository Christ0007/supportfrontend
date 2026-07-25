<template>
  <div class="min-h-screen bg-gray-100">
    <AppNavbar />
    <div class="flex">
      <AppSidebar :is-open="true" :menu-items="menuItems" />
      <main class="flex-1 p-6 ml-64">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const menuItems = [
  { path: '/admin/dashboard', name: 'Tableau de bord', icon: 'chart-bar' },
  { path: '/admin/users', name: 'Utilisateurs', icon: 'users' },
  { path: '/admin/solutions', name: 'Solutions', icon: 'cube' },
  { path: '/admin/companies', name: 'Entreprises', icon: 'building-office' },
]
</script>