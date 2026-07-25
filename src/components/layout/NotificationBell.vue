<template>
  <div class="relative" ref="containerRef">
    <button @click="toggleNotifications" class="text-gray-500 hover:text-gray-700 relative">
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span v-if="notificationStore.unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {{ notificationStore.unreadCount }}
      </span>
    </button>
    
    <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
      <div class="p-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Notifications</h3>
          <button @click="markAllAsRead" class="text-sm text-primary-600 hover:text-primary-700">
            Tout marquer comme lu
          </button>
        </div>
      </div>
      
      <div class="max-h-96 overflow-y-auto">
        <div v-if="notificationStore.notifications.length === 0" class="p-4 text-center text-gray-500">
          Aucune notification
        </div>
        
        <div
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          :class="[
            'p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50',
            !notification.is_read ? 'bg-blue-50' : ''
          ]"
        >
          <p class="text-sm text-gray-900">{{ notification.message }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ formatDate(notification.created_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/formatters'

const notificationStore = useNotificationStore()
const authStore = useAuthStore()
const router = useRouter()
const showNotifications = ref(false)
const containerRef = ref(null)

function handleClickOutside(event) {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    showNotifications.value = false
  }
}

onMounted(() => {
  notificationStore.fetchNotifications()
  document.addEventListener('click', handleClickOutside)
  // Rafraîchir les notifications toutes les 30 secondes
  setInterval(() => {
    notificationStore.fetchNotifications()
  }, 30000)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

async function handleNotificationClick(notification) {
  if (!notification.is_read) {
    await notificationStore.markAsRead(notification.id)
  }

  const incidentId = notification.data?.incident_id
  if (incidentId) {
    showNotifications.value = false
    if (authStore.isTechnician) {
      router.push(`/technician/incidents/${incidentId}`)
    } else if (authStore.isCompany) {
      router.push(`/company/incidents/${incidentId}`)
    }
  }
}

async function markAllAsRead() {
  await notificationStore.markAllAsRead()
}
</script>