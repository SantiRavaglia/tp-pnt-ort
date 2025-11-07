<!-- client/src/App.vue -->
<template>
  <div class="layout">
    <!-- Sidebar sólo si hay sesión y está abierta -->
    <transition name="sidebar">
      <Sidebar v-if="auth.isAuthenticated && ui.sidebarOpen" />
    </transition>

    <!-- Contenido: ocupa todo cuando no hay sidebar -->
    <main class="content" :class="{ 'full': !auth.isAuthenticated || !ui.sidebarOpen }">
      <router-view />
    </main>

    <!-- Botón flotante para abrir/cerrar (visible si hay sesión) -->
    <button
      v-if="auth.isAuthenticated"
      class="sidebar-toggle"
      :title="ui.sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'"
      @click="ui.toggleSidebar()"
    >
      <span v-if="ui.sidebarOpen">«</span>
      <span v-else>»</span>
    </button>

    <!-- Capa UI global (toasts + modal) -->
    <UiLayer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import UiLayer from './components/UiLayer.vue'
import { useAuthStore } from './stores/auth'
import { useUiStore } from './stores/ui'

const auth = useAuthStore()
const ui = useUiStore()
onMounted(() => { auth.ensureSynced?.() })
</script>

<style scoped>
.layout { display:flex; min-height:100vh; }

/* Contenido crece; cuando no hay sidebar, centramos (login/register) */
.content { flex:1; padding: 1rem 1.4rem; transition: padding-left .2s ease }
.content.full {
  display:flex; justify-content:center; align-items:center;
  background: radial-gradient(circle at center, #0e1a25 0%, #050910 100%);
}

/* Animación de aparición/desaparición de la sidebar */
.sidebar-enter-from, .sidebar-leave-to { opacity: 0; transform: translateX(-10px); }
.sidebar-enter-active, .sidebar-leave-active { transition: all .18s ease; }

/* Botón flotante para toggle */
.sidebar-toggle {
  position: fixed;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 55;
  width: 34px; height: 34px;
  display:grid; place-items:center;
  border-radius: 999px;
  border: 1px solid #2a3240;
  background: rgba(15,20,27,.9);
  color: #cfd8ff;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0,0,0,.35);
  transition: transform .12s ease, background .2s ease;
}
.sidebar-toggle:hover {
  background: #121922;
  transform: translateY(-50%) scale(1.05);
}
.sidebar-toggle span { font-size: 16px; line-height: 0; }
</style>
