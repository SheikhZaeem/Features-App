<template>
  <header class="header">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/add">Submit Feature</router-link>
      <router-link to="/admin" v-if="isAdmin">Admin</router-link>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isAdmin = ref(true); // Replace with real auth check later
</script>

<style scoped>
.header {
  background: #2c3e50;
  padding: 1rem;
}

nav a {
  color: white;
  margin-right: 1rem;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}
</style>