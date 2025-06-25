import { ref } from 'vue'

const isAuthenticated = ref(false);
const currentUser = ref(null);

export function initAuth() {
  const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
  const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  if (storedAuth && storedUser) {
    isAuthenticated.value = storedAuth;
    currentUser.value = storedUser;
  }
}

export function useAuth() {
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/users?email=' + email)
      const users = await response.json();
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        isAuthenticated.value = true;
        currentUser.value = user;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }
  
const logout = () => {
  isAuthenticated.value = false;
  currentUser.value = null;
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUser');
}

  return { isAuthenticated, currentUser, login, logout, initAuth }
}