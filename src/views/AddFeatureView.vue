<template>
  <div class="container">
    <h1>Submit a Feature Request</h1>
    <form @submit.prevent="submitFeature" class="feature-form">
      
      <div class="form-group">
        <input 
          v-model="title" 
          placeholder="Feature title" 
          required 
          class="form-input"
        />
      </div>
      <div class="form-group">
        <textarea 
          v-model="description" 
          placeholder="Describe your feature in detail..." 
          required 
          class="form-textarea"
        ></textarea>
      </div>
      <button type="submit" class="submit-button">
        Submit Feature Request
      </button>
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

const submitFeature = async () => {
  await store.addFeature({
    title: title.value,
    description: description.value
  });
  router.push('/');
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  color: #0a1a2f;
  margin-bottom: 2rem;
  text-align: center;
}

.feature-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input {
  height: 50px;
}

.form-textarea {
  min-height: 150px;
  resize: vertical;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #00c4ff;
  box-shadow: 0 0 0 2px rgba(0, 196, 255, 0.1);
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background: #00c4ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background: #00a8e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 196, 255, 0.2);
}
</style>