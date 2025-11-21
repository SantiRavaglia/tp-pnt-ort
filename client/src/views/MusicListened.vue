<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMusicStore } from '../stores/musicStore'
import { useAuthStore } from '../stores/auth'

const musicStore = useMusicStore()
const authStore = useAuthStore()

// solo saco isLoading del store como ref
const { isLoading } = storeToRefs(musicStore)
const { user } = storeToRefs(authStore)

const mode = ref('albums')

function formatDuration(seconds) {
  const years = Math.floor(seconds / (365 * 24 * 3600))
  if (years > 0) return `${years} año(s)`

  const months = Math.floor(seconds / (30 * 24 * 3600))
  if (months > 0) return `${months} mes(es)`

  const days = Math.floor(seconds / (24 * 3600))
  if (days > 0) return `${days} día(s)`

  const hours = Math.floor(seconds / 3600)
  if (hours > 0) return `${hours} hora(s)`

  const minutes = Math.floor(seconds / 60)
  if (minutes > 0) return `${minutes} minuto(s)`

  return `${seconds} segundo(s)`
}

// ⬇️ Álbumes por usuario logueado
const albumStats = computed(() => {
  if (!user.value) return []
  return musicStore.albumsWithListensByUser(user.value.id)
})

// ⬇️ Géneros por usuario logueado 
const genreStats = computed(() => {
  if (!user.value) return []
  return musicStore.genreTimeByUser(user.value.id)
})

const isStatsLoading = computed(() => isLoading.value)

onMounted(async () => {
  if (!musicStore.albums.length) {
    await musicStore.getAlbums
  }
  if (!musicStore.albumListens.length) {
    await musicStore.fetchAlbumListens()
  }
  if (!musicStore.genres?.length) {
    await musicStore.fetchGenres()
  }
})
</script>

<template>
  <div class="stats-view">
    <h2>Estadísticas de escuchas</h2>

    <div class="toggle">
      <button
        :class="{ active: mode === 'albums' }"
        @click="mode = 'albums'"
      >
        Álbumes
      </button>
      <button
        :class="{ active: mode === 'genres' }"
        @click="mode = 'genres'"
      >
        Géneros
      </button>
    </div>

    <p v-if="isStatsLoading">Cargando datos...</p>

    <!-- TAB ÁLBUMES -->
    <template v-else-if="mode === 'albums'">
      <template v-if="!user">
        <p>Debés estar logueado para ver estadísticas por álbum.</p>
      </template>

      <template v-else>
        <p v-if="albumStats.length === 0">
          Todavía no hay álbumes con escuchas registradas para tu usuario.
        </p>

        <ul v-else class="items-list">
          <li
            v-for="album in albumStats"
            :key="album.id"
            class="item"
          >
            <div class="item-main">
              <span class="item-title">
                {{ album.artist }} — {{ album.album }}
              </span>
              <span class="item-year">({{ album.year }})</span>
            </div>
            <div class="item-metrics">
              Tiempo escuchado:
              <strong>
                {{ formatDuration(album.total_listens * album.duration_s) }}
              </strong>
            </div>
          </li>
        </ul>
      </template>
    </template>

    <!-- TAB GÉNEROS -->
    <template v-else>
      <p v-if="!user">
        Debés estar logueado para ver estadísticas por género.
      </p>

      <template v-else>
        <p v-if="genreStats.length === 0">
          Todavía no hay géneros con tiempo escuchado registrado para tu usuario.
        </p>

        <ul v-else class="items-list">
          <li
            v-for="genre in genreStats"
            :key="genre.id"
            class="item"
          >
            <div class="item-main">
              <span class="item-title">{{ genre.name }}</span>
            </div>
            <div class="item-metrics">
              Tiempo escuchado:
              <strong>{{ formatDuration(genre.total_seconds) }}</strong>
            </div>
          </li>
        </ul>
      </template>
    </template>
  </div>
</template>

<style scoped>
.stats-view {
  padding: 20px;
}

.toggle {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
}

.toggle button {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #555;
  background: #222;
  color: #eee;
  cursor: pointer;
}

.toggle button.active {
  background: #007bff;
  border-color: #007bff;
  color: #fff;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
}

.item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.item-main {
  font-size: 1rem;
}

.item-title {
  font-weight: 600;
}

.item-year {
  margin-left: 4px;
  opacity: 0.8;
}

.item-metrics {
  font-size: 0.9rem;
  margin-top: 4px;
  color: #a0c4ff;
}
</style>
