import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AddFeatureView from '@/views/AddFeatureView.vue';
import AdminView from '@/views/AdminView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import { useAuth } from '@/services/auth';

const routes = [
  {
    path: '/',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/add',
    component: AddFeatureView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    component: RegisterView,
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, currentUser } = useAuth();
  
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    next('/');
    return;
  }

  // checking authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login');
    return;
  }

  // checking admin privileges
  if (to.meta.requiresAdmin && !currentUser.value?.isAdmin) {
    next('/');
    return;
  }

  next();
});

export default router;