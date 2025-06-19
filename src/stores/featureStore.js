import { defineStore } from 'pinia';

export const featureStore = defineStore('features', {  // 'features' is the store ID
  state: () => ({             // state is a function that returns the store's initial state.
    features: [
      {
        id: 1,
        title: 'Dark Mode',
        description: 'Add a dark theme option',
        upvotes: 15,
        exists: false,
        comments: [
          { user: 'Admin', text: 'Already in Settings > Theme.' }
        ]
      }
    ]
  }),
  actions: {                   // actions are functions that can change the state.
    addFeature(feature) {
      this.features.push({
        id: Date.now(),
        ...feature,
        upvotes: 0,
        exists: false,
        comments: []
      });
    },
    upvoteFeature(id) {
      let feature = null;
      for (let i = 0; i < this.features.length; i++) {
        if (this.features[i].id === id) {
          feature = this.features[i];
          break;                        
        }
      }
      // SHORTCUT: const feature = this.features.find(f => f.id === id);
      if (feature) {
        feature.upvotes++
      };
    },
    addComment(id, user, text) {
      const feature = this.features.find(f => f.id === id);
      if (feature) {
        feature.comments.push({ user, text })
      };
    },
    markAsExists(id) {
      const feature = this.features.find(f => f.id === id);
      if (feature) {
        feature.exists = true
      };
    }
  }
});