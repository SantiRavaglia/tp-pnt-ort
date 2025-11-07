// client/src/stores/ui.js
import { defineStore } from 'pinia'

const K_SIDEBAR = 'sl_sidebar_open'
let toastId = 0

export const useUiStore = defineStore('ui', {
  state: () => ({
    // toasts
    toasts: [], // { id, text, type }

    // confirm modal
    confirm: {
      open: false,
      title: '',
      message: '',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      _resolver: null
    },

    // sidebar
    sidebarOpen: JSON.parse(localStorage.getItem(K_SIDEBAR) ?? 'true')
  }),

  actions: {
    // --- Toasts ---
    toast(text, type = 'info', timeout = 2200) {
      const id = ++toastId
      this.toasts.push({ id, text, type })
      setTimeout(() => this.dismiss(id), timeout)
    },
    dismiss(id) {
      this.toasts = this.toasts.filter(t => t.id !== id)
    },

    // --- Confirm modal ---
    ask({ title = 'Confirmar', message = '¿Deseás continuar?', confirmText = 'Sí', cancelText = 'Cancelar' } = {}) {
      return new Promise((resolve) => {
        this.confirm.open = true
        this.confirm.title = title
        this.confirm.message = message
        this.confirm.confirmText = confirmText
        this.confirm.cancelText = cancelText
        this.confirm._resolver = (val) => {
          this.confirm.open = false
          resolve(val)
        }
      })
    },
    confirmYes() { this.confirm._resolver?.(true) },
    confirmNo()  { this.confirm._resolver?.(false) },

    // --- Sidebar ---
    setSidebar(val) {
      this.sidebarOpen = !!val
      localStorage.setItem(K_SIDEBAR, JSON.stringify(this.sidebarOpen))
    },
    toggleSidebar() {
      this.setSidebar(!this.sidebarOpen)
    },
    openSidebar()  { this.setSidebar(true)  },
    closeSidebar() { this.setSidebar(false) }
  }
})
