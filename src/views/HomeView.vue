<template>
  <div class="container">
    <h1>Feature Requests</h1>
    
    <div v-if="mergeMode.active" class="merge-mode">
      <h2>Merge Mode (Select 2 features)</h2>
      <div class="merge-controls">
        <button class="btn" @click="cancelMerge">Cancel</button>
        <button 
          class="btn primary" 
          @click="confirmMerge"
          :disabled="mergeMode.selected.length !== 2"
        >
          Merge Selected Features
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading features...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="store.features.length === 0" class="empty">No features found</div>
    <FeatureCard 
      v-else
      v-for="feature in store.features" 
      :key="feature.id" 
      :feature="feature" 
      :merge-mode="mergeMode.active"
      :is-selected="mergeMode.selected.includes(feature.id)"
      @select-for-merge="selectForMerge(feature.id)"
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

const mergeMode = ref({
  active: false,
  selected: []
});

const selectForMerge = (id) => {
  if (!mergeMode.value.active) return;
  
  if (mergeMode.value.selected.includes(id)) {
    mergeMode.value.selected = mergeMode.value.selected.filter(item => item !== id);
  } else if (mergeMode.value.selected.length < 2) {
    mergeMode.value.selected.push(id);
  }
};

const startMerge = () => {
  mergeMode.value = {
    active: true,
    selected: []
  };
};

const cancelMerge = () => {
  mergeMode.value = {
    active: false,
    selected: []
  };
};

const confirmMerge = async () => {
  if (mergeMode.value.selected.length !== 2) return;
  
  const [feature1Id, feature2Id] = mergeMode.value.selected;
  
  try {
    const feature1 = store.features.find(f => f.id === feature1Id);
    const feature2 = store.features.find(f => f.id === feature2Id);
    
    if (!feature1 || !feature2) return;
    
    const keepId = feature1.upvotes >= feature2.upvotes ? feature1Id : feature2Id;
    const removeId = keepId === feature1Id ? feature2Id : feature1Id;
    
    const mergedFeature = {
      ...store.features.find(f => f.id === keepId),
      upvotes: feature1.upvotes + feature2.upvotes,
      comments: [...(feature1.comments || []), ...(feature2.comments || [])],
      upvotedBy: [...new Set([
        ...(feature1.upvotedBy || []),
        ...(feature2.upvotedBy || [])
      ])]
    };
    
    await store.updateFeature(keepId, mergedFeature);
    
    await store.deleteFeature(removeId);
    
    cancelMerge();
    
    alert('Features merged successfully!');
  } catch (err) {
    console.error('Merge failed:', err);
    alert('Failed to merge features');
  }
};

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
/* remove up */
.merge-mode {
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.merge-controls {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn.primary {
  background-color: #1877f2;
  color: white;
  border: none;
}

.btn.primary:disabled {
  background-color: #e4e6eb;
  cursor: not-allowed;
}
</style>