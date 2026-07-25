// src/services/satisfactionService.js
import api from './api'

export const satisfactionService = {
  async get(incidentId) {
    const { data } = await api.get(`/incidents/${incidentId}/satisfaction`)
    return data
  },
  
  async create(incidentId, satisfaction) {
    const { data } = await api.post(`/incidents/${incidentId}/satisfaction`, satisfaction)
    return data
  }
}