<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img 
          src="@/assets/icons/mobivisor-icon.png" 
          alt="Mobivisor" 
          class="login-logo"
        >
        <h1>{{ $t('welcomeBack') }}</h1>
        <p>{{ $t('enterCredentials') }}</p>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">{{ $t('email') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="password">{{ $t('password') }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
            minlength="6"
            class="form-input"
          >
        </div>

        <button type="submit" class="login-button">
          {{ $t('login') }}
        </button>
      </form>

      <div class="login-footer">
        <p>{{ $t('dontHaveAccount') }} <router-link to="/register">{{ $t('signUp') }}</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/services/auth'

const { login } = useAuth()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    if (await login(email.value, password.value)) {
      router.push('/')
    } else {
      error.value = 'Invalid email or password'
    }
  } catch (err) {
    error.value = 'Login failed. Please try again later.'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-logo {
  height: 60px;
  margin-bottom: 1.5rem;
}

.login-header h1 {
  font-size: 1.75rem;
  color: #0a1a2f;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #65676b;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #0a1a2f;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #00c4ff;
  box-shadow: 0 0 0 2px rgba(0, 196, 255, 0.1);
}

.login-button {
  width: 100%;
  padding: 1rem;
  background: #00c4ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.login-button:hover {
  background: #00a8e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 196, 255, 0.2);
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #65676b;
}

.login-footer a {
  color: #00c4ff;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}

.password-warning {
  color: red;
}

.error-message {
  color: #e74c3c;
  background-color: #fdecea;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

</style>