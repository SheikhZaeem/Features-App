<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <img 
          src="@/assets/icons/mobivisor-icon.png" 
          alt="Mobivisor" 
          class="register-logo"
        >
        <h1>{{ $t('createAccount') }}</h1>
        <p>{{ $t('joinCommunity') }}</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form"> 
        <div class="form-group">
          <label for="fullName">{{ $t('fullName') }}</label>
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            placeholder="Enter your full name"
            required
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="username">{{ $t('username') }}</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Choose a username"
            required
            class="form-input"
          >
        </div>
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
            placeholder="Create a password"
            required
            minlength="6"
            class="form-input"
          >
          <p class="password-hint">{{ $t('passwordHint') }}</p>
        </div>
        
        <button type="submit" class="register-button">
          {{ $t('createAccount') }}
        </button>
      </form>
      
      <div class="register-footer">
        <p>{{ $t('alreadyHaveAccount') }} <router-link to="/login">{{ $t('logIn') }}</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/services/auth';

const fullName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();
const { register, login } = useAuth(); 

const handleRegister = async () => {
  try {
    const success = await register(
      fullName.value,
      username.value,
      email.value,
      password.value
    );
    
    if (success) {
      if (await login(email.value, password.value)) {
        router.push('/');
      } else {
        throw new Error('Auto-login failed');
      }
    } else {
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 2rem;
}

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-logo {
  height: 60px;
  margin-bottom: 1.5rem;
}

.register-header h1 {
  font-size: 1.75rem;
  color: #0a1a2f;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #65676b;
  font-size: 0.95rem;
}

.register-form {
  margin-top: 1.5rem;
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

.password-hint {
  font-size: 0.8rem;
  color: #65676b;
  margin-top: 0.5rem;
}

.register-button {
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

.register-button:hover {
  background: #00a8e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 196, 255, 0.2);
}

.register-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #65676b;
}

.register-footer a {
  color: #00c4ff;
  text-decoration: none;
  font-weight: 500;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>