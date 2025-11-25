<template>
  <section class="page">
    <h1>Mi cuenta (Admin)</h1>

    <form class="form-card" @submit.prevent="save">
      <div class="fields">
        <div class="field">
          <label>Nombre</label>
          <input v-model="form.name" type="text" required />
        </div>

        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" required />
        </div>

        <div class="field full">
          <label>Contraseña</label>
          <div class="input-with-btn">
            <input :type="showPass ? 'text' : 'password'" v-model="form.password" minlength="6" required />
            <button type="button" class="ghost" @click="showPass = !showPass">
              {{ showPass ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
          <small class="hint">Mínimo 6 caracteres.</small>
        </div>
      </div>

      <div class="actions">
        <button type="submit" class="primary">Guardar cambios</button>
        <span v-if="msg" class="msg">{{ msg }}</span>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUsersStore } from '../stores/users'

const auth = useAuthStore()
const users = useUsersStore()

const form = reactive({
  name: auth.user?.name || '',
  email: auth.user?.email || '',
  password: auth.user?.password || ''
})
const showPass = ref(false)
const msg = ref('')

function save(){
  try { users.updateUser(auth.user.id, { ...form }); msg.value='Datos actualizados ✔'; setTimeout(()=>msg.value='',1800) }
  catch(e){ msg.value = e.message }
}
</script>

<style scoped>
.page { padding: 2rem; color: #fff; }
h1 { margin: 0 0 1.2rem; }
.form-card { background:#0f141b; border:1px solid #202632; border-radius:16px; padding:1.2rem 1.4rem; max-width:960px; }
.fields { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:1rem 1.2rem; }
.field { display:flex; flex-direction:column; }
.field.full { grid-column: 1 / -1; }
label { font-size:.9rem; opacity:.85; margin-bottom:.35rem; }
input { background:#0b0f15; border:1px solid #2a3240; color:#fff; padding:.65rem .75rem; border-radius:10px; }
.input-with-btn { display:flex; gap:.6rem; align-items:center; }
.input-with-btn input { flex:1 }
.hint { opacity:.6; font-size:.8rem; margin-top:.25rem; display:block }
.actions { margin-top:1rem; display:flex; gap:1rem; align-items:center }
button.primary { background:#3b82f6; color:#fff; border:none; padding:.7rem 1rem; border-radius:10px; cursor:pointer }
button.ghost { background:#131a22; border:1px solid #2a3240; color:#cfd8ff; padding:.55rem .8rem; border-radius:10px; cursor:pointer }
.msg { opacity:.85 }
@media (max-width: 820px){
  .fields { grid-template-columns: 1fr; }
}
</style>
