import { ref } from 'vue'

const isAuthenticated = ref(false)
const currentUser = ref(null)

export function useAuth() {
  const login = async (email, password) => {
    const response = await fetch('http://localhost:3000/users?email=' + email)
    const users = await response.json()
    
    if (users.length && users[0].password === password) {
      isAuthenticated.value = true
      currentUser.value = users[0]
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
    currentUser.value = null
  }

  return { isAuthenticated, currentUser, login, logout }
}