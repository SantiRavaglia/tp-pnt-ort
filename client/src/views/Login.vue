<template>
  <div class="login-page">
    <h1 class="brand">SpotifyListens</h1>

    <form class="login-card" @submit.prevent="loginUser">
      <h2>Iniciar sesión</h2>

      <label>Email</label>
      <input v-model="email" type="email" required />

      <label>Contraseña</label>
      <input v-model="password" type="password" required />

      <button type="submit">Ingresar</button>

      <p class="hint">
        ¿No tenés cuenta?
        <RouterLink to="/register">Registrate acá</RouterLink>
      </p>

      <p v-if="msg" class="msg">{{ msg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()
const email = ref('')
const password = ref('')
const msg = ref('')

function loginUser() {
  try {
    auth.login({ email: email.value, password: password.value })
    ui.toast('Inicio de sesión correcto', 'success')
    router.push('/')
  } catch (e) {
    msg.value = e.message
    ui.toast(e.message, 'error')
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1.2rem;
}

.brand {
  color: #1db954;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.6rem;
  text-shadow: 0 0 10px rgba(29,185,84,0.3);
}

.login-card {
  background: #0f141b;
  border: 1px solid #202632;
  border-radius: 16px;
  padding: 2rem 2.4rem;
  width: 320px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.45);
}

.login-card h2 {
  margin-bottom: 0.6rem;
  font-size: 1.4rem;
}

input {
  background: #0b0f15;
  border: 1px solid #2a3240;
  color: #fff;
  padding: 0.6rem;
  border-radius: 8px;
}

button {
  margin-top: 0.8rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem;
  cursor: pointer;
  font-weight: 500;
}
button:hover {
  background: #2563eb;
}

.hint {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
.hint a {
  color: #9aaaff;
  text-decoration: none;
}
.hint a:hover {
  text-decoration: underline;
}

.msg {
  margin-top: 0.5rem;
  color: #ff7070;
  font-size: 0.85rem;
}
</style>
