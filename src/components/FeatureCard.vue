<template>
  <div class="feature-card">
    <!-- usr profile -->
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
      <button class="action-btn comment">
        💬 Comment
      </button>
      <button class="action-btn delete">
        🗑️ Delete
      </button>
    </div>
    
    <div v-if="feature.exists" class="exists-badge">✓ Already Implemented</div>
    
    <CommentSection 
      :comments="feature.comments" 
      @add-comment="addComment" 
    />
  </div>
</template>

<script setup>
import { featureStore } from '@/stores/featureStore';
import CommentSection from './CommentSection.vue';

const props = defineProps({
  feature: Object,
});

const store = featureStore();

const upvote = () => {
  store.upvoteFeature(props.feature.id);
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
  transform: translateY(-2px);
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
  transform: translateY(-1px);
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
</style>