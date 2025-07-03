<template>
  <div 
    class="feature-card"
    :class="{ 
      'selected-for-merge': isSelected,
      'merge-mode': mergeMode,
      'merged-feature': feature.mergedFrom
    }"
    @click="handleCardClick"
  >
    <div v-if="feature.mergedFrom" class="merged-header">
      <div class="merged-badge">
        🔀 Merged from {{ feature.mergedFrom.length }} feature requests
      </div>
      <div class="merged-avatars">
        <img 
          v-for="user in mergedUsers" 
          :key="user.id"
          class="profile-pic merged-avatar"
          :src="user.avatar || '@/assets/icons/profile-pic-icon.png'"
          :title="user.name"
        />
      </div>
    </div>
    <div class="card-top">
      <img 
        v-if="!feature.mergedFrom"
        class="profile-pic" 
        :src="feature.avatar || '@/assets/icons/profile-pic-icon.png'"
      />
      <div class="user-info">
        <div v-if="feature.mergedFrom" class="name">
          Combined Request
        </div>
        <div v-else class="name">{{ feature.name }}</div>
        
        <div class="username">
          <template v-if="feature.mergedFrom">
            <span v-for="(user, index) in mergedUsers" :key="user.id">
              @{{ user.username }}<span v-if="index < mergedUsers.length - 1">, </span>
            </span>
          </template>
          <template v-else>
            @{{ feature.username }}
          </template>
        </div>
      </div>
    </div>
    <h3 class="title">{{ feature.title }}</h3>
    <p class="description">{{ feature.description }}</p>

     <!-- attachment section -->
    <div v-if="feature.attachments && feature.attachments.length" class="attachments-section">
      <h4>Attachments:</h4>
      <div class="attachments-list">
        <div v-for="(attachment, index) in feature.attachments" :key="index" class="attachment-item">
          <a 
            :href="attachment.url" 
            target="_blank"
            class="attachment-link"
          >
            <span v-if="isImage(attachment.type)" class="attachment-icon">🖼️</span>
            <span v-else-if="isPDF(attachment.type)" class="attachment-icon">📄</span>
            <span v-else class="attachment-icon">📎</span>
            {{ attachment.name }}
          </a>
        </div>
      </div>
    </div>


    <div v-if="feature.mergedFrom" class="merged-content">
      <div class="merged-section">
        <h4>Combined from these requests:</h4>
        
        <div 
          v-for="(req, index) in feature.mergedFrom" 
          :key="req.id"
          class="merged-request"
        >
          <div class="request-header">
            <div class="request-user">
              <img 
                class="profile-pic small"
                :src="req.avatar || '@/assets/icons/profile-pic-icon.png'"
              />
              <div class="request-user-info">
                <div class="name">{{ req.name }}</div>
                <div class="username">@{{ req.username }}</div>
              </div>
            </div>
            <div class="request-title">"{{ req.title }}"</div>
          </div>
          
          <div class="request-description">
            {{ req.description }}
          </div>
          
          <div v-if="index < feature.mergedFrom.length - 1" class="divider"></div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-btn upvote" @click="upvote">
        👍 Upvote ({{ feature.upvotes }})
      </button>
      <button class="action-btn" @click="toggleComments">
        💬 {{ showComments ? 'Hide Comments' : 'Show Comments' }}
      </button>
      
      <button 
        v-if="isAdmin && !feature.exists"
        class="action-btn"
        @click.stop="markAsImplemented"
      >
        ✓ Mark Implemented
      </button>
      
      <button 
        v-if="canDelete" 
        class="action-btn delete" 
        @click.stop="deleteFeature"
      >
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
import { ref, computed, onMounted } from 'vue';
import { featureStore } from '@/stores/featureStore';
import { useAuth } from '@/services/auth';
import CommentSection from './CommentSection.vue';

const { currentUser } = useAuth();
const props = defineProps({
  feature: Object,
  mergeMode: Boolean,
  isSelected: Boolean
});

const store = featureStore();
const showComments = ref(false);
const userComments = ref([]);
const adminComments = ref([]);
const emit = defineEmits(['select-for-merge']);

const isAdmin = computed(() => currentUser.value?.isAdmin || false);

const markAsImplemented = async () => {
  await store.markAsExists(props.feature.id);
};

const handleCardClick = () => {
  if (props.mergeMode) {
    emit('select-for-merge', props.feature.id);
  }
};

const upvote = async () => {
  if (!currentUser.value) return;

  try {
    await store.upvoteFeature(props.feature.id, currentUser.value.id);
  } catch (error) {
    if (error.message === 'User already upvoted') {
      alert('You already upvoted this feature!');
    } else {
      console.error('Failed to upvote:', error);
    }
  }
};

const deleteFeature = async () => {
  if (confirm('Are you sure you want to delete this feature?')) {
    await store.deleteFeature(props.feature.id);
  }
};

const fetchComments = async () => {
  try {
    const response = await fetch(`http://localhost:4000/comments?featureId=${props.feature.id}`);
    const comments = await response.json();
    
    userComments.value = comments
      .filter(comment => !comment.isAdmin)
      .map(comment => ({
        id: comment.id,
        text: comment.text,
        user: comment.username, 
        createdAt: comment.createdAt
      }));
    
    adminComments.value = comments
      .filter(comment => comment.isAdmin)
      .map(comment => ({
        id: comment.id,
        text: comment.text,
        user: comment.name,
        createdAt: comment.createdAt
      }));
  } catch (error) {
    console.error('Failed to fetch comments:', error);
  }
};

const toggleComments = async () => {
  showComments.value = !showComments.value;
  if (showComments.value && userComments.value.length === 0) {
    await fetchComments();
  }
};

const addComment = async (commentData) => {
  try {
    const auth = useAuth();
    const userId = auth.currentUser.value?.id;
    
    // 3. Use new backend endpoint
    await fetch('http://localhost:4000/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: commentData.text, // Only send text
        featureId: props.feature.id,
        userId: userId,
        isAdmin: auth.currentUser.value?.isAdmin || false,
        createdAt: new Date().toISOString()
      })
    });
    await fetchComments(); // Refresh comments
  } catch (error) {
    console.error('Failed to add comment:', error);
  }
};

const isImage = (type) => type.startsWith('image/');
const isPDF = (type) => type === 'application/pdf';

const mergedUsers = computed(() => {
  if (!props.feature.mergedFrom) return [];
  const uniqueUsers = [];
  const seenIds = new Set();
  
  for (const user of props.feature.mergedFrom) {
    if (!seenIds.has(user.userId)) {
      uniqueUsers.push({
        id: user.userId,
        name: user.name,
        username: user.username,
        avatar: user.avatar
      });
      seenIds.add(user.userId);
    }
  }
  
  return uniqueUsers;
});

const canDelete = computed(() => {
  return currentUser.value?.id === props.feature.userId || currentUser.value?.isAdmin;
});

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
  height: 55px;
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
  margin-bottom: 20px;
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
}

.comment p {
  margin: 0.3rem 0 0;
}

.feature-card.merge-mode {
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.feature-card.merge-mode:hover {
  border-color: #1877f2;
}

.feature-card.selected-for-merge {
  border: 2px solid #1877f2;
  background-color: #f0f7ff;
}

.action-buttons > * {
  pointer-events: auto;
}
.merged-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.merged-badge {
  background-color: #e6f7ff;
  color: #0073e6;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.merged-feature {
  border-left: 4px solid #0073e6;
  background-color: #f9fbff;
}

.merged-avatars {
  display: flex;
}

.merged-avatar {
  width: 32px;
  height: 32px;
  margin-left: -10px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #e1e4e8;
}

.merged-avatar:first-child {
  margin-left: 0;
}

.merged-content {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px dashed #e1e4e8;
}

.merged-section {
  background-color: #f8fafd;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.merged-section h4 {
  color: #0073e6;
  margin-bottom: 1rem;
}

.merged-request {
  padding: 1rem 0;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.request-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.request-user-info {
  line-height: 1.2;
}

.request-user .name {
  font-size: 0.9rem;
  font-weight: 500;
}

.request-user .username {
  font-size: 0.8rem;
  color: #666;
}

.request-title {
  font-style: italic;
  color: #555;
  max-width: 50%;
  text-align: right;
  font-size: 0.9rem;
}

.request-description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #444;
  background-color: #f0f4ff;
  padding: 0.8rem;
  border-radius: 6px;
  margin-top: 0.5rem;
}

.profile-pic.small {
  width: 28px;
  height: 28px;
}

.divider {
  height: 1px;
  background-color: #e1e4e8;
  margin: 1rem 0;
}

.attachments-section {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #e1e4e8;
}

.attachments-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 0.5rem;
}

.attachment-item {
  background: #f0f4ff;
  border-radius: 4px;
  padding: 0.5rem;
}

.attachment-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1877f2;
  text-decoration: none;
}

.attachment-link:hover {
  text-decoration: underline;
}

.attachment-icon {
  font-size: 1.2rem;
}

</style>