<template>
  <div class="container">
    <h1>Feature Requests</h1>
    <div v-if="loading" class="loading">Loading features...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="store.features.length === 0" class="empty">No features found</div>
    <FeatureCard 
      v-else
      v-for="feature in store.features" 
      :key="feature.id" 
      :feature="feature" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { featureStore } from '@/stores/featureStore';
import FeatureCard from '@/components/FeatureCard.vue';

const store = featureStore();
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    loading.value = true;
    await store.fetchFeatures();
  } catch (err) {
    console.error('Error loading features:', err);
    error.value = 'Failed to load features. Please try again later.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}
</style>