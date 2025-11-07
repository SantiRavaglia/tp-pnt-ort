<template>
  <!-- Toasts -->
  <div class="toasts">
    <div v-for="t in ui.toasts" :key="t.id" class="toast" :class="t.type">
      <span class="dot"></span>
      <span>{{ t.text }}</span>
      <button class="x" @click="ui.dismiss(t.id)">×</button>
    </div>
  </div>

  <!-- Modal confirm -->
  <div v-if="ui.confirm.open" class="modal-backdrop" @click.self="ui.confirmNo()">
    <div class="modal">
      <h3>{{ ui.confirm.title }}</h3>
      <p class="msg">{{ ui.confirm.message }}</p>
      <div class="actions">
        <button class="ghost" @click="ui.confirmNo()">{{ ui.confirm.cancelText }}</button>
        <button class="danger" @click="ui.confirmYes()">{{ ui.confirm.confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '../stores/ui'
const ui = useUiStore()
</script>

<style scoped>
.toasts { position: fixed; top: 16px; right: 16px; display: grid; gap: 10px; z-index: 60; }
.toast { display:flex; align-items:center; gap:.6rem; background:#0f141b; border:1px solid #202632; color:#fff;
  padding:.6rem .8rem; border-radius:10px; min-width:220px; box-shadow: 0 6px 20px rgba(0,0,0,.35) }
.toast .dot { width:8px; height:8px; border-radius:999px; background:#6b9cff }
.toast.success .dot { background:#22c55e }
.toast.error .dot { background:#ef4444 }
.toast.warn .dot { background:#f59e0b }
.toast .x { margin-left:auto; background:transparent; border:none; color:#9aa4b2; font-size:18px; cursor:pointer }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); backdrop-filter: blur(2px); display:grid; place-items:center; z-index: 70; }
.modal { width:min(520px, 92vw); background:#0f141b; border:1px solid #202632; color:#fff; border-radius:14px; padding:1.1rem 1.2rem; box-shadow: 0 20px 60px rgba(0,0,0,.5) }
.modal h3 { margin:.2rem 0 .6rem; font-size:1.1rem }
.modal .msg { opacity:.85; margin:0 0 1rem }
.actions { display:flex; justify-content:end; gap:.6rem }
button.ghost { background:#131a22; border:1px solid #2a3240; color:#cfd8ff; padding:.55rem .8rem; border-radius:10px; cursor:pointer }
button.danger { background:#7a1f1f; border:1px solid #a72e2e; color:#fff; padding:.55rem .8rem; border-radius:10px; cursor:pointer }
button.danger:hover { background:#c23333 }
</style>
