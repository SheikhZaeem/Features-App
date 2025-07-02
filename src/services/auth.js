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
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) return false;
      
      const user = await response.json();
      isAuthenticated.value = true;
      currentUser.value = user;
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
  
  const register = async (name, username, email, password) => {
    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };
  
  const logout = () => {
    isAuthenticated.value = false;
    currentUser.value = null;
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  };

  return { 
    isAuthenticated, 
    currentUser, 
    login,
    register,
    logout,
    initAuth
  };
}