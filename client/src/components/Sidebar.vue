<template>
  <aside class="sidebar">
    <div class="brand">SpotifyListens</div>
    <nav class="nav">
      <RouterLink v-if="auth.isAuthenticated" to="/" class="nav-btn">Inicio</RouterLink>
      <RouterLink v-if="auth.isAuthenticated" to="/playlist" class="nav-btn">Busqueda</RouterLink>

      <RouterLink v-if="auth.isAuthenticated" to="/estadisticas/albums-escuchados" class="nav-btn">Estadísticas</RouterLink>

      <!-- si es admin, mostrar "Perfiles"; si no, "Perfil" -->
      <RouterLink v-if="auth.isAdmin" to="/perfiles" class="nav-btn">Perfiles</RouterLink>
      <RouterLink v-else-if="auth.isAuthenticated" to="/perfil" class="nav-btn">Perfil</RouterLink>

      <!-- Admin (edición de mi cuenta) visible sólo para admins -->
      <RouterLink v-if="auth.isAdmin" to="/admin" class="nav-btn">Admin</RouterLink>

      <!-- Login o Logout -->
      <RouterLink v-if="!auth.isAuthenticated" to="/login" class="nav-btn">Login</RouterLink>
      <button v-else class="logout-btn" @click="confirmLogout">Salir</button>
    </nav>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

async function confirmLogout() {
  const ok = await ui.ask({
    title: 'Cerrar sesión',
    message: '¿Seguro que querés cerrar sesión?',
    confirmText: 'Salir',
    cancelText: 'Cancelar'
  })
  if (ok) {
    auth.logout()
    ui.toast('Sesión cerrada', 'success')
    router.push('/login')
  }
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: #081018;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.brand {
  font-weight: bold;
  color: #1db954;
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.nav-btn {
  color: #fff;
  text-decoration: none;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: #16212f;
}

/* botón "Salir" */
.logout-btn {
  margin-top: 1rem;
  background: #7a1f1f;
  border: 1px solid #a72e2e;
  color: #fff;
  font-weight: 500;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  transition: background 0.25s, transform 0.1s;
}

.logout-btn:hover {
  background: #c23333;
  transform: scale(1.03);
}
</style>
