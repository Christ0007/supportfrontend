// src/services/solutionService.js
import api from './api'

export const solutionService = {
  async getAll(params = {}) {
    const { data } = await api.get('/software-solutions', { params })
    return data
  },
  
  async getById(id) {
    const { data } = await api.get(`/software-solutions/${id}`)
    return data
  },
  
  async create(solution) {
    const { data } = await api.post('/software-solutions', solution)
    return data
  },
  
  async update(id, solution) {
    const { data } = await api.put(`/software-solutions/${id}`, solution)
    return data
  }
}