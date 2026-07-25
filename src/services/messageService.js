// src/services/messageService.js
import api from './api'

export const messageService = {
  async getAll(incidentId, params = {}) {
    const { data } = await api.get(`/incidents/${incidentId}/messages`, { params })
    return data
  },

  async create(incidentId, content, attachment = null) {
    const formData = new FormData()
    formData.append('content', content)
    if (attachment) {
      formData.append('attachment', attachment)
    }
    const { data } = await api.post(`/incidents/${incidentId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  }
}