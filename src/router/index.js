// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/DashboardPage.vue')
      },

      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('@/pages/ProfilePage.vue')
      },

      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/pages/admin/UsersPage.vue')
      },
      {
        path: 'solutions',
        name: 'AdminSolutions',
        component: () => import('@/pages/admin/SolutionsPage.vue')
      },
      {
        path: 'solutions/create',
        name: 'AdminSolutionCreate',
        component: () => import('@/pages/admin/SolutionFormPage.vue'),
        props: { mode: 'create' }
      },
      {
        path: 'solutions/:id/edit',
        name: 'AdminSolutionEdit',
        component: () => import('@/pages/admin/SolutionFormPage.vue'),
        props: { mode: 'edit' }
      }
    ]
  },
  {
    path: '/technician',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true, role: 'technician' },
    children: [
      {
        path: 'dashboard',
        name: 'TechnicianDashboard',
        component: () => import('@/pages/technician/DashboardPage.vue')
      },
      {
        path: 'profile',
        name: 'TechnicianProfile',
        component: () => import('@/pages/ProfilePage.vue')
      },
      {
        path: 'incidents',
        name: 'TechnicianIncidents',
        component: () => import('@/pages/technician/IncidentsPage.vue')
      },
      {
        path: 'incidents/:id',
        name: 'TechnicianIncidentDetail',
        component: () => import('@/pages/technician/IncidentDetailPage.vue')
      }
    ]
  },
  {
    path: '/company',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true, role: 'company' },
    children: [
      {
        path: 'dashboard',
        name: 'CompanyDashboard',
        component: () => import('@/pages/company/DashboardPage.vue')
      },
      {
        path: 'profile',
        name: 'CompanyProfile',
        component: () => import('@/pages/ProfilePage.vue')
      },
      {
        path: 'incidents',
        name: 'CompanyIncidents',
        component: () => import('@/pages/company/IncidentsPage.vue')
      },
      {
        path: 'incidents/create',
        name: 'CompanyIncidentCreate',
        component: () => import('@/pages/company/IncidentFormPage.vue')
      },
      {
        path: 'incidents/:id',
        name: 'CompanyIncidentDetail',
        component: () => import('@/pages/company/IncidentDetailPage.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.isLoading) {
    await new Promise(resolve => {
      const unwatch = watch(() => authStore.isLoading, (val) => {
        if (!val) { unwatch(); resolve() }
      })
    })
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  if (to.meta.guest && authStore.isAuthenticated) {
    authStore.redirectByRole(authStore.userRole)
    return
  }
  
  if (to.meta.role && authStore.userRole !== to.meta.role) {
    authStore.redirectByRole(authStore.userRole)
    return
  }
  
  next()
})

export default router