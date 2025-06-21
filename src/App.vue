<template>
  <AppHeader />
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
  import AppHeader from '@/components/AppHeader.vue';
</script>

<style>
  @import '@/assets/main.css';
</style>