// src/stores/notification.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationService } from '@/services/notificationService'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const unreadCount = computed(() => notifications.value.filter(n => !n.is_read).length)
  const loading = ref(false)

  async function fetchNotifications() {
    loading.value = true
    try {
      const response = await notificationService.getAll()
      const list = response.notifications?.data ?? response.data ?? []
      notifications.value = Array.isArray(list) ? list : []
      return response
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(id) {
    await notificationService.markAsRead(id)
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.is_read = true
      notification.read_at = new Date().toISOString()
    }
  }

  async function markAllAsRead() {
    await notificationService.markAllAsRead()
    notifications.value.forEach(n => {
      n.is_read = true
      n.read_at = new Date().toISOString()
    })
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  }
})