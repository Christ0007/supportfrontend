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
  { path: '/company/dashboard', name: 'Tableau de bord', icon: 'chart-bar' },
  { path: '/company/incidents', name: 'Mes incidents', icon: 'exclamation-triangle' },
]
</script>