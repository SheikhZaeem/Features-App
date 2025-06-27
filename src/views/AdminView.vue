<template>
  <div>
    <h1>Admin Panel</h1>
    <FeatureCard 
      v-for="feature in pendingFeatures" 
      :key="feature.id" 
      :feature="feature" 
      @mark-exists="markAsExists(feature.id)"
    />
  </div>
</template>

<script setup>
import { featureStore } from '@/stores/featureStore';
import FeatureCard from '@/components/FeatureCard.vue';

const store = featureStore();
const pendingFeatures = store.features.filter(f => !f.exists);

const markAsExists = (id) => {
  store.markAsExists(id);
};

</script>