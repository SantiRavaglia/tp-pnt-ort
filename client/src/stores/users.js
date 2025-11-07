import { defineStore } from 'pinia'
import { DB } from '../services/db'
import { useAuthStore } from './auth'

const KEY     = 'sl_users'
const KEY_SEQ = 'sl_users_seq'

function needsMigration(list) {
  // si hay algún id "estilo timestamp" o ids duplicados/incongruentes
  return list.some(u => String(u.id).length > 6) ||
         new Set(list.map(u => u.id)).size !== list.length
}

export const useUsersStore = defineStore('users', {
  state: () => {
    const defaultUsers = [
      { id: 1, email: 'admin@spotifylistens.com',   password: 'admin123',   name: 'Administrador SpotifyListens', role: 'admin' },
      { id: 2, email: 'manager@spotifylistens.com', password: 'manager123', name: 'Gestor SpotifyListens',        role: 'admin' },
      { id: 3, email: 'demo@user.com',           password: 'user123',    name: 'Usuario Demo',              role: 'user'  }
    ]
    let list = DB.get(KEY, defaultUsers)

    // 🔧 MIGRACIÓN: si hay IDs largos o raros → reasignar 1..N manteniendo el orden
    if (needsMigration(list)) {
      const byId = [...list].sort((a,b) => a.id - b.id)
      list = byId.map((u, i) => ({ ...u, id: i + 1 }))
      DB.set(KEY, list)
      DB.set(KEY_SEQ, list.length)
    }

    // si no existe la secuencia, la calculo
    let seq = DB.get(KEY_SEQ, null)
    if (seq === null) {
      seq = list.reduce((m,u) => u.id > m ? u.id : m, 0)
      DB.set(KEY_SEQ, seq)
    }

    return { list, seq }
  },

  getters: {
    admins(s){ return s.list.filter(u => u.role === 'admin') },
    byId: (s) => (id) => s.list.find(u => u.id === id),
    byEmail: (s) => (email) => s.list.find(u => u.email === email)
  },

  actions: {
    _save(){ DB.set(KEY, this.list); DB.set(KEY_SEQ, this.seq) },
    _nextId(){ this.seq += 1; DB.set(KEY_SEQ, this.seq); return this.seq },

    register({ name, email, password }) {
      if (this.list.some(u => u.email === email)) {
        throw new Error('El correo ya está registrado.')
      }
      const newUser = { id: this._nextId(), name, email, password, role: 'user' }
      this.list.push(newUser)
      this._save()
      return newUser
    },

    findUser(email, password) { return this.list.find(u => u.email === email && u.password === password) },

    updateUser(userId, patch){
      const i = this.list.findIndex(u => u.id === userId)
      if (i === -1) throw new Error('Usuario no encontrado')
      this.list[i] = { ...this.list[i], ...patch }
      this._save()
      const auth = useAuthStore()
      if (auth.user?.id === userId) auth._refreshFromUsers(this.list[i])
    },

    setRole(userId, role){
      const user = this.byId(userId)
      if (!user) throw new Error('Usuario no encontrado')
      if (user.role === 'admin' && role !== 'admin' && this.admins.length <= 1)
        throw new Error('Debe quedar al menos un administrador.')
      this.updateUser(userId, { role })
    },

    removeUser(userId){
      const user = this.byId(userId)
      if (!user) return
      const auth = useAuthStore()
      if (user.role === 'admin' && this.admins.length <= 1)
        throw new Error('No podés eliminar al último administrador.')
      this.list = this.list.filter(u => u.id !== userId)
      this._save()
      if (auth.user?.id === userId) auth.logout()
    }
  }
})
