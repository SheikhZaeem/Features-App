<template>
  <div class="container">
    <h1>Submit a Feature Request</h1>
    <form @submit.prevent="submitFeature">
      <input v-model="title" placeholder="Title" required />
      <textarea v-model="description" placeholder="Description" required></textarea>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { featureStore } from '@/stores/featureStore';
import { useRouter } from 'vue-router';

const title = ref('');
const description = ref('');
const store = featureStore();
const router = useRouter();

const submitFeature = () => {
  store.addFeature({
    title: title.value,
    description: description.value,
  });
  router.push('/');
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  gap: 1rem;
}

input, textarea {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>