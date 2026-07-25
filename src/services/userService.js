// src/services/userService.js
import api from './api'

export const userService = {
  async getAll(params = {}) {
    const { data } = await api.get('/users', { params })
    return data
  },
  
  async getById(id) {
    const { data } = await api.get(`/users/${id}`)
    return data
  },
  
  async create(user) {
    const { data } = await api.post('/users', user)
    return data
  },
  
  async update(id, user) {
    const { data } = await api.put(`/users/${id}`, user)
    return data
  },
  
async deactivate(id) {
    const { data } = await api.patch(`/users/${id}/deactivate`)
    return data
  },

  async activate(id) {
    const { data } = await api.patch(`/users/${id}/activate`)
    return data
  }
}