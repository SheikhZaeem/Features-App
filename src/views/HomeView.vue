<template>
  <div class="container">
    <h1>Feature Requests</h1>
    
    <div v-if="isAdmin" class="admin-controls">
      <button 
        v-if="!mergeMode.active"
        class="btn merge-btn"
        @click="startMerge"
      >
        🔄 Merge Features
      </button>
      
      <div v-else class="merge-mode">
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
import { ref, onMounted, computed } from 'vue';
import { featureStore } from '@/stores/featureStore';
import { useAuth } from '@/services/auth';
import FeatureCard from '@/components/FeatureCard.vue';

const store = featureStore();
const { currentUser } = useAuth();
const loading = ref(true);
const error = ref('');
const isAdmin = computed(() => currentUser.value?.isAdmin || false);

// merge functionality
const mergeMode = ref({
  active: false,
  selected: []
});

const startMerge = () => {
  mergeMode.value = {
    active: true,
    selected: []
  };
};

const selectForMerge = (id) => {
  if (!mergeMode.value.active) return;
  
  if (mergeMode.value.selected.includes(id)) {
    mergeMode.value.selected = mergeMode.value.selected.filter(item => item !== id);
  } else if (mergeMode.value.selected.length < 2) {
    mergeMode.value.selected.push(id);
  }
};

const cancelMerge = () => {
  mergeMode.value = {
    active: false,
    selected: []
  };
};

const confirmMerge = async () => {
  if (mergeMode.value.selected.length < 2) return;
  
  try {
    const featuresToMerge = mergeMode.value.selected.map(id => 
      store.features.find(f => f.id === id)
    ).filter(Boolean);
    
    if (featuresToMerge.length < 2) return;

    const keptFeature = featuresToMerge.reduce((prev, current) => 
      prev.upvotes > current.upvotes ? prev : current
    );
    
    const removedFeatures = featuresToMerge.filter(f => f.id !== keptFeature.id);
    
    // create merged feature data
    const mergedFeature = {
      ...keptFeature,
      title: keptFeature.title,
      description: `## Merged from multiple feature requests:\n\n${
        featuresToMerge.map(f => `- **${f.title}** (by @${f.username})`).join('\n')
      }\n\n---\n\n${featuresToMerge.map(f => f.description).join('\n\n---\n\n')}`,
      upvotes: featuresToMerge.reduce((sum, f) => sum + f.upvotes, 0),
      upvotedBy: [...new Set(
        featuresToMerge.flatMap(f => f.upvotedBy || [])
      )],
      mergedFrom: featuresToMerge.map(f => ({
        id: f.id,
        userId: f.userId,
        username: f.username,
        name: f.name
      }))
    };
    await store.updateFeature(keptFeature.id, mergedFeature);

    await Promise.all(
      removedFeatures.map(f => store.deleteFeature(f.id))
    );
    cancelMerge();
    
    alert(`Merged ${featuresToMerge.length} features successfully!`);
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
.admin-controls {
  margin-bottom: 1.5rem;
}

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
  border: 1px solid #ddd;
}

.btn.merge-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
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