<template>
  <div class="feature-card">
    <div class="card-top">
      <img class="profile-pic" src="@/assets/icons/profile-pic-icon.png"/>
      <div>
        <h2>{{ feature.name }}</h2>
        <h1>{{ feature.username }} </h1>
      </div>
    </div>
    <h3>{{ feature.title }}</h3>
    <p>{{ feature.description }}</p>
    <div class="meta">
      <button @click="upvote">👍 {{ feature.upvotes }}</button>
      <span v-if="feature.exists" class="exists-badge">Already Exists</span>
    </div>
    <button class="feature-button">Delete</button>
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
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.exists-badge {
  color: green;
  margin-left: 1rem;
}

.feature-button {
  margin-top: 20px;
}

.card-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 20px;
}

.profile-pic {
  width: 40px;
}
</style>