import { defineStore } from 'pinia';
import { useAuth } from '@/services/auth';

export const featureStore = defineStore('features', {
  state: () => ({
    features: []
  }),
  actions: {
    async fetchFeatures() {
      try {
        const response = await fetch('http://localhost:4000/features');
        this.features = await response.json();
      } catch (error) {
        console.error('Failed to fetch features:', error);
      }
    },
    
    async addFeature(formData) {
      try {
        const auth = useAuth();
        const userId = auth.currentUser.value?.id;
        if (!userId) throw new Error('User not authenticated');
        
        formData.append('userId', userId);
        formData.append('upvotes', '0');
        formData.append('exists', 'false');
        
        const response = await fetch('http://localhost:4000/features', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Failed to add feature');
        await this.fetchFeatures();
      } catch (error) {
        console.error('Failed to add feature:', error);
        throw error;
      }
    },
    
    async deleteFeature(id) {
      try {
        await fetch(`http://localhost:4000/features/${id}`, {
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
        const feature = this.features.find(f => f.id === featureId);
        if (!feature) throw new Error('Feature not found');
        
        if (feature.upvotedBy?.includes(userId)) {
          throw new Error('User already upvoted');
        }
        
        const updatedData = {
          upvotes: feature.upvotes + 1,
          upvotedBy: [...(feature.upvotedBy || []), userId]
        };
        
        await fetch(`http://localhost:4000/features/${featureId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });
        
        await this.fetchFeatures();
      } catch (error) {
        console.error('Failed to upvote feature:', error);
        throw error;
      }
    },
    
    async markAsExists(id) {
      try {
        await fetch(`http://localhost:4000/features/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exists: true })
        });
        await this.fetchFeatures();
      } catch (error) {
        console.error('Failed to mark as implemented:', error);
        throw error;
      }
    },
  
    async updateFeature(id, updatedData) {
      try {
        await fetch(`http://localhost:4000/features/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });
        await this.fetchFeatures();
      } catch (error) {
        console.error('Failed to update feature:', error);
        throw error;
      }
    },
    
    async fetchComments(featureId) {
      try {
        const response = await fetch(
          `http://localhost:4000/comments?featureId=${featureId}`
        );
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        return [];
      }
    },
    
    async addComment(comment) {
      try {
        const auth = useAuth();
        const userId = auth.currentUser.value?.id;
        if (!userId) throw new Error('User not authenticated');
        
        await fetch('http://localhost:4000/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...comment,
            userId,
            isAdmin: auth.currentUser.value?.isAdmin || false
          })
        });
      } catch (error) {
        console.error('Failed to add comment:', error);
        throw error;
      }
    }
  }
});