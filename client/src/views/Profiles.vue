<template>
  <section class="page">
    <h1>Perfiles de usuarios</h1>

    <table class="users">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th style="width:220px">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="u in users.list" :key="u.id">
          <td class="id">{{ u.id }}</td>

          <td>
            <input v-model="drafts[u.id].name" placeholder="Nombre" />
          </td>

          <td>
            <input v-model="drafts[u.id].email" placeholder="Email" type="email" />
          </td>

          <td>
            <select v-model="drafts[u.id].role">
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </td>

          <td class="actions">
            <button
              class="primary"
              :disabled="!isDirty(u)"
              @click="saveRow(u.id)"
              title="Guardar cambios"
            >
              Guardar
            </button>

            <button
              class="danger"
              :disabled="disableDelete(u)"
              @click="removeRow(u.id)"
              title="Eliminar usuario"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useUsersStore } from '../stores/users'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const users = useUsersStore()
const auth  = useAuthStore()
const ui    = useUiStore()

const drafts = reactive({})

function hydrateDrafts() {
  users.list.forEach(u => {
    drafts[u.id] = drafts[u.id] || { name: u.name, email: u.email, role: u.role }
  })
  Object.keys(drafts).forEach(id => {
    if (!users.list.find(u => u.id === Number(id))) delete drafts[id]
  })
}
hydrateDrafts()
watch(() => users.list, hydrateDrafts, { deep: true })

function isDirty(u) {
  const d = drafts[u.id]
  return d && (d.name !== u.name || d.email !== u.email || d.role !== u.role)
}

async function saveRow(id) {
  const u = users.byId(id)
  const d = drafts[id]
  if (!u || !d || !isDirty(u)) return

  const ok = await ui.ask({
    title: 'Guardar cambios',
    message: `¿Confirmás guardar los cambios de "${u.name}"?`,
    confirmText: 'Guardar',
    cancelText: 'Cancelar'
  })
  if (!ok) return

  try {
    if (d.role !== u.role) users.setRole(id, d.role)

    const patch = {}
    if (d.name !== u.name)  patch.name  = d.name
    if (d.email !== u.email) patch.email = d.email
    if (Object.keys(patch).length) users.updateUser(id, patch)

    ui.toast('Cambios guardados', 'success')
  } catch (e) {
    ui.toast(e.message, 'error')
    drafts[id] = { name: u.name, email: u.email, role: u.role } // rollback visual
  }
}

async function removeRow(id) {
  const u = users.byId(id); if (!u) return

  const ok = await ui.ask({
    title: 'Eliminar usuario',
    message: `⚠ Se eliminará "${u.name}" (${u.email}). Esta acción no se puede deshacer.`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar'
  })
  if (!ok) return

  try {
    users.removeUser(id)
    ui.toast('Usuario eliminado', 'success')
  } catch (e) {
    ui.toast(e.message, 'error')
  }
}

function disableDelete(u){
  if (auth.user?.id === u.id) return true // no borrarse a sí mismo
  return (u.role === 'admin' && users.admins.length <= 1) // no dejar sin admins
}
</script>

<style scoped>
.page { padding:2rem; color:#fff }
h1 { margin-bottom:1rem }

table.users {
  width:100%;
  border-collapse:collapse;
  background:#0f141b;
  border:1px solid #202632;
  border-radius:12px;
  overflow:hidden;
}
th, td { border-bottom:1px solid #202632; padding:.6rem .8rem; text-align:left }
th { background:#10161f }
td.id { opacity:.85; width:56px }

input, select {
  background:#0b0f15;
  border:1px solid #2a3240;
  color:#fff;
  padding:.45rem .6rem;
  border-radius:8px;
  width:100%;
}

.actions {
  display:flex;
  gap:.5rem;
  align-items:center;
}

button {
  padding:.45rem .8rem;
  border:1px solid #2a3240;
  background:#131a22;
  color:#fff;
  border-radius:8px;
  cursor:pointer;
  transition:background .2s, opacity .2s, transform .06s;
}
button:active { transform: scale(0.98); }

button.primary { background:#2a3b6b; border-color:#3b4e85 }
button.primary:hover { background:#3b5bb6 }
button.danger  { background:#7a1f1f; border-color:#a72e2e }
button.danger:hover { background:#c23333 }

button:disabled { opacity:.55; cursor:not-allowed }
</style>
