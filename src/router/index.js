import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AddFeatureView from '@/views/AddFeatureView.vue';
import AdminView from '@/views/AdminView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/add', component: AddFeatureView },
  { path: '/admin', component: AdminView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;