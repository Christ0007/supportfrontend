// src/services/incidentService.js
import api from './api'

export const incidentService = {
  async getAll(params = {}) {
    const { data } = await api.get('/incidents', { params })
    return data
  },
  
  async getById(id) {
    const { data } = await api.get(`/incidents/${id}`)
    return data
  },
  
  async create(incident) {
    const { data } = await api.post('/incidents', incident)
    return data
  },
  
  async update(id, incident) {
    const { data } = await api.put(`/incidents/${id}`, incident)
    return data
  },
  
  async takeOver(id) {
    const { data } = await api.post(`/incidents/${id}/take-over`)
    return data
  },
  
  async updateStatus(id, status) {
    const { data } = await api.patch(`/incidents/${id}/status`, { status })
    return data
  },
  
  async getTransitions(id) {
    const { data } = await api.get(`/incidents/${id}/transitions`)
    return data
  }
}