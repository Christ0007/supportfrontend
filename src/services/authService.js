// src/services/authService.js
import api from './api'

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/login', credentials)
    return data
  },
  
  async logout() {
    const { data } = await api.post('/logout')
    return data
  },
  
  async getCurrentUser() {
    const { data } = await api.get('/me')
    return data
  },
  
  async changePassword(passwords) {
    const { data } = await api.post('/change-password', passwords)
    return data
  }
}