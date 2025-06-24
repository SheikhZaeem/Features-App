import { useAuth } from '@/services/auth'

export const authGuard = (to, from, next) => {
  const { isAuthenticated } = useAuth()
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else {
    next()
  }
}