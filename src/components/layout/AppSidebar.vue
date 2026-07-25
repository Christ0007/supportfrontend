<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-30 md:hidden" @click="$emit('close-sidebar')"></div>

  <aside :class="[
    'fixed top-16 left-0 h-[calc(100%-4rem)] transition-all duration-300 z-40 overflow-hidden flex flex-col shadow-lg rounded-r-2xl border-r',
    theme.bg,
    theme.border,
    isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-16 md:translate-x-0'
  ]">
    <nav class="mt-4 px-2 space-y-1 flex-1 overflow-y-auto">
      <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        :class="[!isOpen ? 'md:justify-center' : '', theme.link]" :active-class="theme.active"
        @click="$emit('close-sidebar')">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath(item.icon)" />
        </svg>
        <span v-if="isOpen || true" class="md:hidden lg:inline" v-show="isOpen">{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="p-2 border-t flex-shrink-0" :class="theme.border">
      <button @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        :class="[!isOpen ? 'md:justify-center' : '', theme.logout]">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span v-show="isOpen">Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const props = defineProps({
  isOpen: Boolean,
  menuItems: Array,
  theme: { type: String, default: 'blue' }
})

defineEmits(['close-sidebar'])

const authStore = useAuthStore()

const theme = {
  bg: 'bg-white',
  border: 'border-gray-200',
  link: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  active: '!bg-gray-100 !text-gray-900 !font-semibold',
  logout: 'text-red-600 hover:bg-gray-100'
}

const icons = {
  'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'users': 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-1a4 4 0 10-4-4',
  'cube': 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
  'exclamation-triangle': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  'building-office': 'M3 21h18M3 7v14M21 7v14M6 7l6-4 6 4M9 21V11h6v10'
}

function iconPath(name) {
  return icons[name] || icons['chart-bar']
}

async function handleLogout() {
  const result = await Swal.fire({
    title: 'Déconnexion',
    text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Annuler'
  })
  if (result.isConfirmed) {
    await authStore.logout()
  }
}
</script>