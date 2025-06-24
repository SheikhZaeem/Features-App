import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AddFeatureView from '@/views/AddFeatureView.vue';
import AdminView from '@/views/AdminView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/add', component: AddFeatureView },
  { path: '/admin', component: AdminView },
  { path: '/login', component: LoginView},
  { path: '/Register', component: RegisterView}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;