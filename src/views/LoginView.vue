<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img 
          src="@/assets/icons/mobivisor-icon.png" 
          alt="Mobivisor" 
          class="login-logo"
        >
        <h1>Welcome Back</h1>
        <p>Please enter your credentials to log in</p>
      </div>
      
      <form @submit.prevent="$emit('submit', { email, password })" class="login-form">
        <div class="form-group">
          <label for="email">Email Address</label>
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
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
            class="form-input"
          >
        </div>
        <p v-if="!passwordCondition && password.length > 0" class="password-warning"> At least 6, first capital</p>
        
        <button type="submit" class="login-button" @click="userLogin">
          Log In
        </button>
      </form>
      
      <div class="login-footer">
        <p>Don't have an account? <router-link to="/Register">Sign up</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const email = ref('');
const password = ref('');

const passwordCondition = computed(() => {
  return password.value.length >= 6 && password.value.charAt(0) === password.value.charAt(0).toUpperCase();
});



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
</style>