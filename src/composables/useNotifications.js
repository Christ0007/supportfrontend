import { computed, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'

export function useNotifications() {
  const store = useNotificationStore()
  let interval

  onMounted(() => {
    store.fetchNotifications()
    interval = setInterval(() => store.fetchNotifications(), 30000)
  })

  onUnmounted(() => clearInterval(interval))

  return {
    notifications: computed(() => store.notifications),
    unreadCount: computed(() => store.unreadCount),
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    fetchNotifications: store.fetchNotifications
  }
}