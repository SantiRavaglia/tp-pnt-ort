import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import SearchMusic from '../views/SearchMusic.vue'
import ResultsList from '../components/ResultsList.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard },
    // despues: { path: '/search', component: () => import('@/views/Search.vue') }
    { path: '/playlist', name: 'consulta', component: () => import('../views/SearchMusic.vue') },
  ]
})
