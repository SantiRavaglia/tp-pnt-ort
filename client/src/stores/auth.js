import { defineStore } from 'pinia'
import { useUsersStore } from './users'

const KUSER='sl_user', KTOKEN='sl_token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem(KUSER) || 'null'),
    token: localStorage.getItem(KTOKEN) || null
  }),
  getters: {
    isAuthenticated: s => !!s.token,
    role: s => s.user?.role || 'guest',
    isAdmin() { return this.role === 'admin' },
    id: s => s.user?.id || null
  },
  actions: {
    login({ email, password }) {
      const users = useUsersStore()
      const found = users.findUser(email, password)
      if (!found) throw new Error('Credenciales inválidas')
      this.user = found
      this.token = 'spotifylens-' + Math.random().toString(36).substring(2)
      localStorage.setItem(KUSER, JSON.stringify(this.user))
      localStorage.setItem(KTOKEN, this.token)
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem(KUSER)
      localStorage.removeItem(KTOKEN)
    },
    /** llamado desde usersStore cuando se edita al usuario logueado */
    _refreshFromUsers(nextUser){
      this.user = nextUser
      localStorage.setItem(KUSER, JSON.stringify(this.user))
    }
  }
})
