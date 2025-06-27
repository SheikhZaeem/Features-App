import { defineStore } from 'pinia';
import { useAuth } from '@/services/auth';

export const featureStore = defineStore('features', {
  state: () => ({
    features: []
  }),
  actions: {
    async fetchFeatures() {
      try {
        // fetching features and users separately
        const featuresRes = await fetch('http://localhost:3000/features');
        const features = await featuresRes.json();
        
        const usersRes = await fetch('http://localhost:3000/users');
        const users = await usersRes.json();
        // mapping user data to features
        this.features = features.map(feature => {
          const user = users.find(u => u.id === feature.userId.toString());
          return {
            ...feature,
            name: user?.name || 'Unknown',
            username: user?.username || 'unknown',
            avatar: user?.avatar || '@/assets/icons/profile-pic-icon.png'
          };
        });
      } catch (error) {
        console.error('Failed to fetch features:', error);
      }
    },
    async addFeature(feature) {
      try {
        const auth = useAuth();
        const userId = auth.currentUser.value?.id;
        
        if (!userId) throw new Error('User not authenticated');
        await fetch('http://localhost:3000/features', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...feature,
            userId: userId,
            upvotes: 0,
            exists: false,
            createdAt: new Date().toISOString()
          })
        });
        await this.fetchFeatures();
      } catch (error) {
        console.error('Failed to add feature:', error);
      }
    },
     async deleteFeature(id) {
    try {
      await fetch(`http://localhost:3000/features/${id}`, {
        method: 'DELETE'
      });
      this.features = this.features.filter(f => f.id !== id);
    } catch (error) {
      console.error('Failed to delete feature:', error);
      throw error;
    }
  },
    async upvoteFeature(featureId, userId) {
      try {
        const featureRes = await fetch(`http://localhost:3000/features/${featureId}`);
        const feature = await featureRes.json();
      
        if (feature.upvotedBy?.includes(userId)) {
          throw new Error('User already upvoted');
        }
        const updatedData = {
          upvotes: feature.upvotes + 1,
          upvotedBy: [...(feature.upvotedBy || []), userId]
        };
        await fetch(`http://localhost:3000/features/${featureId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });
      } catch (error) {
        console.error('Failed to upvote feature:', error);
        throw error;
      }
    }
  }
});