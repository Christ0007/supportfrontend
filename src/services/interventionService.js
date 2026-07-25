// src/services/interventionService.js
import api from './api'

export const interventionService = {
  async getAll(incidentId, params = {}) {
    const { data } = await api.get(`/incidents/${incidentId}/interventions`, { params })
    return data
  },
  
  async create(incidentId, intervention) {
    const { data } = await api.post(`/incidents/${incidentId}/interventions`, intervention)
    return data
  }
}