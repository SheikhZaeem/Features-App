<template>
  <div class="feature-card">
    <div class="card-top">
      <img class="profile-pic" src="@/assets/icons/profile-pic-icon.png"/>
      <div class="user-info">
        <div class="name">{{ feature.name }}</div>
        <div class="username">@{{ feature.username }}</div>
      </div>
    </div>
    
    <h3 class="title">{{ feature.title }}</h3>
    <p class="description">{{ feature.description }}</p>
    
    <div class="action-buttons">
      <button class="action-btn upvote" @click="upvote">
        👍 Upvote ({{ feature.upvotes }})
      </button>
      <button class="action-btn comment" @click="toggleComments">
        💬 {{ showComments ? 'Hide Comments' : 'Show Comments' }}
      </button>
      <button class="action-btn delete">
        🗑️ Delete
      </button>
    </div>
    
    <div v-if="feature.exists" class="exists-badge">✓ Already Implemented</div>
    
    <div v-if="adminComments.length" class="admin-comments">
      <div class="comment-header">
        <span class="admin-badge">ADMIN</span>
        <h4>Official Responses</h4>
      </div>
      <div v-for="comment in adminComments" :key="comment.id" class="comment">
        <p>{{ comment.text }}</p>
      </div>
    </div>
    
    <div v-if="showComments" class="user-comments">
      <div v-if="userComments.length" class="comment-header">
        <h4>User Comments ({{ userComments.length }})</h4>
      </div>
      <div v-for="comment in userComments" :key="comment.id" class="comment">
        <strong>{{ comment.user }}:</strong>
        <p>{{ comment.text }}</p>
      </div>
      
      <CommentSection 
        @add-comment="addComment" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { featureStore } from '@/stores/featureStore';
import CommentSection from './CommentSection.vue';

const props = defineProps({
  feature: Object,
});

const store = featureStore();
const showComments = ref(false);

const adminComments = computed(() =>                      // separate admin comments
  props.feature.comments.filter(c => c.user === 'Admin')
);

const userComments = computed(() =>                        // separate user comments
  props.feature.comments.filter(c => c.user !== 'Admin')
);

const upvote = () => {
  store.upvoteFeature(props.feature.id);
};

const toggleComments = () => {
  showComments.value = !showComments.value;
};

const addComment = (comment) => {
  store.addComment(props.feature.id, 'User', comment.text);
};
</script>

<style scoped>
.feature-card {
  border: 1px solid #e1e4e8;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.profile-pic {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f2f5;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 600;
  font-size: 1.05rem;
  color: #1d2129;
}

.username {
  font-size: 0.85rem;
  color: #65676b;
  margin-top: 2px;
}

.title {
  font-size: 1.3rem;
  color: #050505;
  margin: 0.5rem 0 0.8rem 0;
  line-height: 1.4;
}

.description {
  color: #444950;
  line-height: 1.5;
  margin-bottom: 1.2rem;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin: 1rem 0;
}

.action-btn {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  background: #f0f2f5;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-btn:hover {
  background: #e4e6e9;
  transform: translateY(-2px);
}

.upvote {
  background: #e7f3ff;
  color: #1877f2;
}

.comment {
  background: #f0f4ff;
  color: #385898;
}

.delete {
  background: #fff0f0;
  color: #e0245e;
}

.exists-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background: #e6f7ee;
  color: #00a854;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.admin-comments {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0f0ff;
}

.user-comments {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.admin-badge {
  background: #1877f2;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.comment {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
}

.comment p {
  margin: 0.3rem 0 0;
}
</style>