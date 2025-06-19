<template>
  <div class="container">
    <h1>Feature Requests</h1>
    <FeatureCard 
      v-for="feature in store.features" 
      :key="feature.id" 
      :feature="feature" 
    />
  </div>
</template>

<script setup>
import { featureStore } from '@/stores/featureStore';
import FeatureCard from '@/components/FeatureCard.vue';

const store = featureStore();

</script>