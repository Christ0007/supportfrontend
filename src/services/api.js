// src/services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error
    
    if (response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(error)
    }
    
    if (response?.status === 403) {
      Swal.fire({
        icon: 'error',
        title: 'Accès non autorisé',
        text: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.',
      })
    }
    
    return Promise.reject(error)
  }
)

export default api