<template>
  <header class="app-header">
    <div class="header-overlay"></div>
    <div class="header-content">
      <router-link to="/" class="logo">
        <img 
          src="@/assets/icons/mobivisor-icon.png" 
          alt="Mobivisor" 
          class="logo-image"
        >
      </router-link>
      <nav>
        <!-- when authenticated -->
        <template v-if="isAuthenticated">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/add" class="nav-link">Submit Feature</router-link>
          <router-link 
            to="/admin" 
            class="nav-link admin-link" 
            v-if="isAdmin"
          >
            Admin
          </router-link>
          <button @click="handleLogout" class="nav-link logout-button">
            Logout
          </button>
          <span class="user-greeting">
            Hi, {{ currentUser.username }}
          </span>
        </template>
        <!-- when not authenticated -->
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useAuth } from '@/services/auth';
import { useRouter } from 'vue-router';

const { isAuthenticated, currentUser, logout } = useAuth();
const router = useRouter();

const isAdmin = computed(() => currentUser.value?.isAdmin || false);

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<style scoped>
.app-header {
  background-color: #0a1a2f; 
  background-image: url('src/assets/icons/MobiVisor-Homepage-BG.jpg'); 
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  padding: 1.5rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  filter: 
  brightness(1.2) 
  contrast(1.1); 
}

.header-content {
  position: relative;
  max-width: 1600px;
  /* margin: 10px auto; */
  padding: 0 2rem;
  padding-left: 10px;
  margin-left: 150px;
  display: grid;
  grid-template-columns: auto 1fr; 
  align-items: center;
  
}

.logo {
  height: 50px;
  filter: brightness(0) invert(1);
  opacity: 0.9;
  position: sticky;
  left: 2rem;
  z-index: 2;
}

.logo-image {
  height: 100%;
  width: auto;
  max-width: 180px; 
}

nav {
  display: flex;
  justify-content: end;
  gap: 2rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 500;
  position: relative;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #00c4ff;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #00c4ff;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.router-link-active::after {
  width: 100%;
}

.admin-link {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: rgba(0, 196, 255, 0.1);
  border: 1px solid rgba(0, 196, 255, 0.3);
}

.admin-link:hover {
  background: rgba(0, 196, 255, 0.2);
}

.logout-button {
  background: none;
  border: none;
  cursor: pointer;
}

.user-greeting {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-left: 1rem;
  display: flex;
  align-items: center;
}

.logout-button:hover {
  color: #00c4ff;
}

.logout-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #00c4ff;
  transition: width 0.3s ease;
}

.logout-button:hover::after {
  width: 100%;
}
</style>