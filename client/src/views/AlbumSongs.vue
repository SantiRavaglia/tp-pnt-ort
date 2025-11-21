<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMusicStore } from '../stores/musicStore'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import SongCard from '../components/SongCard.vue'

const route = useRoute()
const router = useRouter()

const musicStore = useMusicStore()
const authStore  = useAuthStore()

const { albums, songs, albumListens } = storeToRefs(musicStore)
const { user, isAuthenticated } = storeToRefs(authStore)

const albumId = computed(() => Number(route.params.id))

onMounted(async () => {
  // Por si entrás directo con F5
  if (!albums.value.length) {
    await musicStore.fetchAlbums('', 'artist')
  }
  if (!songs.value.length) {
    await musicStore.fetchSongs()
  }
})

const album = computed(() =>
  albums.value.find(a => a.id === albumId.value)
)

const albumSongs = computed(() =>
  songs.value.filter(s => s.album_id === albumId.value)
)

// ---------- Veces escuchado por vos ----------
const userAlbumListens = computed(() => {
  if (!user.value || !album.value) return 0

  const rec = albumListens.value.find(
    l => l.album_id === album.value.id && l.user_id === user.value.id
  )

  return rec?.times_listened ?? 0
})

// ---------- Toast local ----------
const toastVisible = ref(false)
const toastMessage = ref('')

let toastTimeoutId = null

function showToast(message) {
  toastMessage.value = message
  toastVisible.value = true

  if (toastTimeoutId) clearTimeout(toastTimeoutId)
  toastTimeoutId = setTimeout(() => {
    toastVisible.value = false
  }, 2500)
}

// ---------- Acciones ----------
async function escucharAlbum() {
  if (!isAuthenticated.value || !user.value || !album.value) return

  await musicStore.incrementAlbumListen(album.value.id, user.value.id)
  showToast('Se sumó una reproducción al álbum')
}

function volver() {
  router.push('/playlist')
}
</script>

<template>
  <div class="album-songs">
    <!-- Toast -->
    <div v-if="toastVisible" class="toast">
      <span class="dot"></span>
      <span class="toast-text">{{ toastMessage }}</span>
      <button class="toast-close" @click="toastVisible = false">✕</button>
    </div>

    <button class="back" @click="volver">← Volver a la búsqueda</button>

    <div class="header-row">
      <div>
        <h2 v-if="album">
          Canciones del álbum {{ album.album }} — {{ album.artist }}
        </h2>
        <h2 v-else>
          Canciones del álbum
        </h2>

        <p
          v-if="album && isAuthenticated"
          class="user-count"
        >
          Veces escuchado por vos:
          <strong>{{ userAlbumListens }}</strong>
        </p>
      </div>

      <div v-if="album" class="album-actions">
        <button class="play-btn" @click="escucharAlbum">
          ▶ Escuchar álbum (sumar reproducción)
        </button>
      </div>
    </div>

    <p v-if="!albumSongs.length">
      Este álbum no tiene canciones cargadas o aún no se pudieron cargar.
    </p>

    <div v-else class="songs-grid">
      <SongCard
        v-for="song in albumSongs"
        :key="song.id"
        :song="song"
      />
    </div>
  </div>
</template>

<style scoped>
.album-songs {
  padding: 20px;
}

/* Toast tipo login, arriba a la derecha */
.toast {
  position: fixed;
  top: 16px;
  right: 16px;
  background: #020617;
  border-radius: 10px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(34, 197, 94, 0.5);
  z-index: 1000;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
}

.toast-text {
  color: #e5e7eb;
  font-size: 0.9rem;
}

.toast-close {
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 0.8rem;
}

.back {
  margin-bottom: 12px;
  background: transparent;
  border: 1px solid #4b5563;
  color: #e5e7eb;
  border-radius: 999px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 0.9rem;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.header-row h2 {
  margin: 0;
}

.user-count {
  margin-top: 4px;
  font-size: 0.9rem;
  color: #e5e7eb;
  opacity: 0.9;
}

.user-count strong {
  color: #22c55e;
}

.album-actions {
  margin-bottom: 16px;
}

.play-btn {
  background: #22c55e;
  border: none;
  color: #022c22;
  padding: 8px 18px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  box-shadow: 0 0 0 1px #15803d88;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
}

.play-btn:hover {
  background: #16a34a;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(22, 163, 74, 0.45);
}

.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}
</style>
