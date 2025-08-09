import { defineStore } from 'pinia'
import { ref } from 'vue'
import { router } from "@/router/router.ts"
import api, { setAuthRefreshFunction } from '@/services/api'

interface LoginCredentials {
  email: string
  password: string
}

interface User {
  id: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref('')

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = ''

    try {
      const response = await api.post('/auth/login', credentials)
      
      token.value = response.data.token
      user.value = response.data.user
      isAuthenticated.value = true
      
      localStorage.setItem('token', response.data.token)
      
      return { success: true, data: response.data }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }
  
  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      // Continue with logout even if API call fails
    }
    
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }
  
  async function refresh(): Promise<string> {
    try {
      const response = await api.post('/auth/refresh')
      
      token.value = response.data.token
      user.value = response.data.user
      isAuthenticated.value = true
      
      localStorage.setItem('token', response.data.token)
      
      return response.data.token
    } catch (err) {
      // Refresh failed, logout user
      await logout()
      router.push('/login')
      throw new Error('Token refresh failed')
    }
  }

  async function checkAuth() {
    if (!token.value) return false

    try {
      const response = await api.get('/auth/me')
      user.value = response.data
      isAuthenticated.value = true
      router.push('/')
      return true
    } catch (err) {
      await logout()
      return false
    }
  }
  
  function initializeAuth() {
    if (token.value) {
      checkAuth()
    }
  }
  
  async function register(credentials: LoginCredentials) {
    loading.value = true
    error.value = ''

    try {
      const response = await api.post('/auth/register', credentials)
      
      token.value = response.data.token
      user.value = response.data.user
      isAuthenticated.value = true
      
      localStorage.setItem('token', response.data.token)
      
      return { success: true, data: response.data }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Initialize the auth refresh function for the API interceptor
  setAuthRefreshFunction(refresh)

  return {
    isAuthenticated,
    token,
    user,
    loading,
    error,
    login,
    register,
    logout,
    refresh,
    checkAuth,
    initializeAuth
  }
})