<template>
  <div class="comment-section">
    <div class="comment-input-container">
      <textarea
        v-model="newComment"
        placeholder="Write a comment..."
        class="comment-input"
      ></textarea>
      <button 
        @click="addComment"
        :disabled="!newComment.trim()"
        class="post-button"
      >
        Post
      </button>
    </div>
  </div>
</template>
<script setup>

import { ref } from 'vue';

const newComment = ref('');
const emit = defineEmits(['add-comment']);

const addComment = () => {
  if (newComment.value.trim()) {
    emit('add-comment', {
      text: newComment.value,
    });
    newComment.value = '';
  }
};
</script>

<style scoped>
.comment-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}
.comment-input-container {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
.comment-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 60px;
  transition: all 0.2s ease;
}
.comment-input:focus {
  outline: none;
  border-color: #1877f2;
  box-shadow: 0 0 0 2px rgba(24, 119, 242, 0.1);
}
.post-button {
  padding: 8px 16px;
  height: 40px;
  background: #1877f2;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.post-button:hover:not(:disabled) {
  background: #166fe5;
  transform: translateY(-1px);
}
.post-button:disabled {
  background: #e4e6eb;
  color: #bcc0c4;
  cursor: not-allowed;
}
</style>