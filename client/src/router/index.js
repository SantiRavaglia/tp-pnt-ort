import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import { useAuthStore } from '../stores/auth'
import MusicListenedView from '../views/MusicListened.vue'

const Login        = () => import('../views/Login.vue')
const SearchMusic  = () => import('../views/SearchMusic.vue')
const Profile      = () => import('../views/Profile.vue')
const Admin        = () => import('../views/Admin.vue')
const AlbumSongs = () => import('../views/AlbumSongs.vue')
const Recommended  = () => import('../views/Recommended.vue')

export const router = createRouter({
  history: createWebHistory(),
    routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: () => import('../views/Register.vue') },
    { path: '/perfiles', name: 'perfiles', component: () => import('../views/Profiles.vue'), meta: { auth: true, role: 'admin' } },
    { path: '/',             name: 'dashboard',    component: Dashboard,   meta: { auth: true } },
    { path: '/playlist',     name: 'consulta',     component: SearchMusic, meta: { auth: true } },
    { path: '/perfil',       name: 'perfil',       component: Profile,     meta: { auth: true } },
    { path: '/admin',        name: 'admin',        component: Admin,       meta: { auth: true, role: 'admin' } },
    { path: '/album/:id',    name: 'album-songs',  component: AlbumSongs,  meta: { auth: true } },
    { path: '/recomendados', name: 'recomendados', component: Recommended, meta: { auth: true } },
    { path: '/estadisticas/musica-escuchada', name: 'MusicListened', component: MusicListenedView },

    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],

  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta?.auth && !auth.isAuthenticated) return { name: 'login' }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'dashboard' }
  if (to.meta?.role === 'admin' && !auth.isAdmin) return { name: 'dashboard' }
})


