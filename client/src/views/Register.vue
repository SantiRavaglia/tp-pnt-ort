<!-- client/src/views/Register.vue -->
<template>
  <div class="auth-page">
    <h1 class="brand">SpotifyListens</h1>

    <form class="card" @submit.prevent="onSubmit">
      <h2>Crear cuenta</h2>

      <label>Nombre</label>
      <input v-model.trim="name" type="text" required placeholder="Tu nombre" />

      <label>Email</label>
      <input v-model.trim="email" type="email" required placeholder="tu@mail.com" />

      <label>Contraseña</label>
      <div class="input-with-btn">
        <input :type="showPass ? 'text' : 'password'" v-model="password" minlength="6" required />
        <button type="button" class="ghost" @click="showPass = !showPass">
          {{ showPass ? 'Ocultar' : 'Mostrar' }}
        </button>
      </div>

      <label>Repetir contraseña</label>
      <input :type="showPass ? 'text' : 'password'" v-model="password2" minlength="6" required />

      <p v-if="password && password2 && !same" class="warn">Las contraseñas no coinciden.</p>

      <button type="submit" class="primary" :disabled="!canSubmit">Registrarme</button>

      <p class="hint">
        ¿Ya tenés cuenta?
        <RouterLink to="/login">Iniciar sesión</RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../stores/users'
import { useUiStore } from '../stores/ui'

const router = useRouter()
const users = useUsersStore()
const ui = useUiStore()

const name = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const showPass = ref(false)

const same = computed(() => password.value === password2.value)
const canSubmit = computed(() =>
  name.value.trim().length >= 2 &&
  email.value.trim().length > 3 &&
  password.value.length >= 6 &&
  same.value
)

async function onSubmit() {
  if (!canSubmit.value) return

  const ok = await ui.ask({
    title: 'Confirmar registro',
    message: `Vas a crear la cuenta para "${name.value}" (${email.value}). ¿Continuar?`,
    confirmText: 'Crear cuenta',
    cancelText: 'Cancelar'
  })
  if (!ok) return

  try {
    await users.register({
      name: name.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value
    })
    ui.toast('Cuenta creada correctamente', 'success')
    router.push('/login')
  } catch (e) {
    ui.toast(e.message || 'No se pudo crear la cuenta', 'error')
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  gap: 1rem;
  background: radial-gradient(circle at center, #0e1a25 0%, #050910 100%);
  padding: 1rem;
}
.brand {
  color: #1db954;
  font-size: 2rem;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(29,185,84,0.3);
}
.card {
  width: min(380px, 92vw);
  background:#0f141b; border:1px solid #202632; color:#fff;
  border-radius:16px; padding:1.6rem 1.8rem;
  display:flex; flex-direction:column; gap:.7rem;
  box-shadow: 0 10px 30px rgba(0,0,0,.45);
}
.card h2 { margin:0 0 .4rem; font-size:1.35rem }
label { font-size:.9rem; opacity:.85 }
input {
  background:#0b0f15; border:1px solid #2a3240; color:#fff;
  padding:.6rem .65rem; border-radius:10px;
}
.input-with-btn { display:flex; gap:.5rem; align-items:center }
.input-with-btn input { flex:1 }
button.primary {
  margin-top:.3rem; background:#3b82f6; color:#fff; border:none;
  padding:.7rem; border-radius:10px; cursor:pointer; font-weight:600
}
button.primary:hover { background:#2563eb }
button.primary:disabled { opacity:.6; cursor:not-allowed }
button.ghost {
  background:#131a22; border:1px solid #2a3240; color:#cfd8ff;
  padding:.55rem .8rem; border-radius:10px; cursor:pointer
}
.hint { margin-top:.2rem; font-size:.9rem }
.hint a { color:#9aaaff; text-decoration:none }
.hint a:hover { text-decoration:underline }
.warn { color:#f59e0b; font-size:.85rem; margin:.1rem 0 0 }
</style>
