<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'

const router = useRouter()
const authStore = useAuthStore()

// Login form
const loginEmail = ref('')
const loginPassword = ref('')

// Register form
const registerEmail = ref('')
const registerPassword = ref('')
const registerConfirmPassword = ref('')
const registerError = ref('')

const handleLogin = async () => {
  if (!loginEmail.value || !loginPassword.value) {
    return
  }

  const result = await authStore.login({
    email: loginEmail.value,
    password: loginPassword.value,
  })

  if (result.success) {
    router.push('/')
  }
}

const handleRegister = async () => {
  registerError.value = ''

  if (!registerEmail.value || !registerPassword.value || !registerConfirmPassword.value) {
    registerError.value = 'All fields are required'
    return
  }

  if (registerPassword.value !== registerConfirmPassword.value) {
    registerError.value = 'Passwords do not match'
    return
  }

  if (registerPassword.value.length < 6) {
    registerError.value = 'Password must be at least 6 characters long'
    return
  }

  const result = await authStore.register({
    email: registerEmail.value,
    password: registerPassword.value,
  })

  if (result.success) {
    router.push('/')
  } else {
    registerError.value = result.error
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-form">
      <TabsRoot default-value="login" class="tabs-root">
        <TabsList class="tabs-list">
          <TabsTrigger value="login" class="tabs-trigger">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" class="tabs-trigger">
            Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" class="tabs-content">
          <div class="form-container">
            <h2>Welcome Back</h2>
            <p class="subtitle">Sign in to your account</p>
            
            <form @submit.prevent="handleLogin">
              <div class="form-group">
                <label for="login-email">Email Address</label>
                <input
                  id="login-email"
                  v-model="loginEmail"
                  type="email"
                  required
                  :disabled="authStore.loading"
                  placeholder="Enter your email"
                />
              </div>

              <div class="form-group">
                <label for="login-password">Password</label>
                <input
                  id="login-password"
                  v-model="loginPassword"
                  type="password"
                  required
                  :disabled="authStore.loading"
                  placeholder="Enter your password"
                />
              </div>

              <div v-if="authStore.error" class="error-message">
                {{ authStore.error }}
              </div>

              <button type="submit" :disabled="authStore.loading" class="submit-button">
                {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="register" class="tabs-content">
          <div class="form-container">
            <h2>Create Account</h2>
            <p class="subtitle">Sign up for a new account</p>
            
            <form @submit.prevent="handleRegister">
              <div class="form-group">
                <label for="register-email">Email Address</label>
                <input
                  id="register-email"
                  v-model="registerEmail"
                  type="email"
                  required
                  :disabled="authStore.loading"
                  placeholder="Enter your email"
                />
              </div>

              <div class="form-group">
                <label for="register-password">Password</label>
                <input
                  id="register-password"
                  v-model="registerPassword"
                  type="password"
                  required
                  :disabled="authStore.loading"
                  placeholder="Create a password"
                />
              </div>

              <div class="form-group">
                <label for="register-confirm-password">Confirm Password</label>
                <input
                  id="register-confirm-password"
                  v-model="registerConfirmPassword"
                  type="password"
                  required
                  :disabled="authStore.loading"
                  placeholder="Confirm your password"
                />
              </div>

              <div v-if="registerError" class="error-message">
                {{ registerError }}
              </div>

              <button type="submit" :disabled="authStore.loading" class="submit-button">
                {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
              </button>
            </form>
          </div>
        </TabsContent>
      </TabsRoot>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 1rem;
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  width: 100%;
  max-width: 420px;
}

.tabs-root {
  width: 100%;
}

.tabs-list {
  display: flex;
  background-color: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 2rem;
}

.tabs-trigger {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.tabs-trigger[data-state="active"] {
  background-color: white;
  color: #1e293b;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.tabs-trigger:hover:not([data-state="active"]) {
  color: #475569;
}

.tabs-content {
  outline: none;
}

.form-container h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

.subtitle {
  text-align: center;
  margin-bottom: 2rem;
  color: #64748b;
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: white;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  opacity: 0.5;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #fecaca;
  font-size: 0.875rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.submit-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}
</style>