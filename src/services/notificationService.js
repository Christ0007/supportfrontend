// src/services/notificationService.js
import api from './api'

export const notificationService = {
  async getAll(params = {}) {
    const { data } = await api.get('/notifications', { params })
    return data
  },
  
  async markAsRead(id) {
    const { data } = await api.patch(`/notifications/${id}/read`)
    return data
  },
  
  async markAllAsRead() {
    const { data } = await api.patch('/notifications/read-all')
    return data
  }
}