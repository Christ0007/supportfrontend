// src/services/dashboardService.js
import api from './api'

export const dashboardService = {
  async getStats(params = {}) {
    const { data } = await api.get('/dashboard', { params })
    return data
  }
}