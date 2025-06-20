<template>
  <header class="app-header">
    <div class="header-overlay"></div>
    <div class="header-content">
      <router-link to="/" class="logo">
        <span class="logo-text">MOBIVISOR</span>
      </router-link>
      <nav>
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/add" class="nav-link">Submit Feature</router-link>
        <router-link to="/admin" class="nav-link admin-link" v-if="isAdmin">Admin</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isAdmin = ref(true); //replae with real auth check later
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
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 26, 47, 0.124);
}

.header-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 1px;
}

nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 1.1rem;
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

.router-link-active {
  color: #00c4ff;
}

.router-link-active::after {
  width: 100%;
}

.admin-link {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: rgba(0, 196, 255, 0.1);
  border: 1px solid rgba(0, 196, 255, 0.3);
}

.admin-link:hover {
  background: rgba(0, 196, 255, 0.2);
}
</style>