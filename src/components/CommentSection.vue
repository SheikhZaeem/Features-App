<template>
  <div class="comments">
    <h3>Comments: </h3>
    <div v-for="comment in comments" :key="comment.id">
      <strong>{{ comment.user }}:</strong> {{ comment.text }}
    </div>
    <input v-model="newComment" @keyup.enter="addComment" placeholder="Add a comment" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  comments: Array,
  featureId: Number,
});

const newComment = ref('');
const emit = defineEmits(['add-comment']);

const addComment = () => {
  if (newComment.value.trim()) {
    emit('add-comment', {
      featureId: props.featureId,
      text: newComment.value,
    });
    newComment.value = '';
  }
};
</script>