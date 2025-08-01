<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/" class="logo">
        <img 
          src="@/assets/icons/mobivisor-icon.png" 
          alt="Mobivisor" 
          class="logo-image"
        >
      </router-link>
      <nav>
        <template v-if="isAuthenticated">
          <router-link to="/" class="nav-link">{{ $t('home') }}</router-link>
          <router-link 
            to="/add" 
            class="nav-link" 
            v-if="!isAdmin"
          >
            {{ $t('submitFeature') }}
          </router-link>
          <button @click="handleLogout" class="nav-link logout-button">
            {{ $t('logout') }}
          </button>
          <div class="user-info">
            <span class="user-greeting">
              Hi, {{ currentUser.username }}
            </span>
            <span v-if="isAdmin" class="admin-badge">ADMIN</span>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">{{ $t('login') }}</router-link>
          <router-link to="/register" class="nav-link">{{ $t('register') }}</router-link>
        </template>
        <select v-model="currentLocale" @change="changeLanguage" class="language-switcher">
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="tr">Türkçe</option>
          <option value="zh">中文</option>
        </select>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted  } from 'vue';
import { useAuth } from '@/services/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const { isAuthenticated, currentUser, logout } = useAuth();
const router = useRouter();
const currentLocale = ref(locale.value);
const isAdmin = computed(() => currentUser.value?.isAdmin || false);

const changeLanguage = () => {
  locale.value = currentLocale.value;
  localStorage.setItem('userLocale', currentLocale.value);
};

onMounted(() => {
  const savedLocale = localStorage.getItem('userLocale');
  if (savedLocale) {
    locale.value = savedLocale;
    currentLocale.value = savedLocale;
  }
});

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<style scoped>
.app-header {
  background-color: #0a1a2f; 
  background-image: url('src/assets/icons/MobiVisor-Homepage-BG.jpg'); 
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  padding: 1.5rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  filter: 
  brightness(1.2) 
  contrast(1.1); 
}

.header-content {
  position: relative;
  max-width: 1600px;
  /* margin: 10px auto; */
  padding: 0 2rem;
  padding-left: 10px;
  margin-left: 150px;
  display: grid;
  grid-template-columns: auto 1fr; 
  align-items: center;
  
}

.logo {
  height: 50px;
  filter: brightness(0) invert(1);
  opacity: 0.9;
  position: sticky;
  left: 2rem;
  z-index: 2;
}

.logo-image {
  height: 100%;
  width: auto;
  max-width: 180px; 
}

nav {
  display: flex;
  justify-content: end; 
  gap: 2rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 500;
  position: relative;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #00c4ff;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #00c4ff;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.router-link-active::after {
  width: 100%;
}

.admin-link {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: rgba(0, 196, 255, 0.1);
  border: 1px solid rgba(0, 196, 255, 0.3);
}

.admin-link:hover {
  background: rgba(0, 196, 255, 0.2);
}

.logout-button {
  background: none;
  border: none;
  cursor: pointer;
}

.user-greeting {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
}

.logout-button:hover {
  color: #00c4ff;
}

.logout-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #00c4ff;
  transition: width 0.3s ease;
}

.logout-button:hover::after {
  width: 100%;
}

.admin-badge {
  background: #1877f2;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
}

.language-switcher {
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.2);
  color: white;
  cursor: pointer;
}

.language-switcher option {
  background: #0a1a2f;
}

</style>