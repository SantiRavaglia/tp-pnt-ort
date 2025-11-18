<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMusicStore } from '../stores/musicStore'

const musicStore = useMusicStore()
const { albumsWithListens, genresWithListens, isLoading } = storeToRefs(musicStore)

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

const isStatsLoading = computed(() => isLoading.value)

onMounted(async () => {
  if (!musicStore.allAlbums.length) {
    await musicStore.fetchAlbums('', 'artist')
  }
  if (!musicStore.albumListens.length) {
    await musicStore.fetchAlbumListens()
  }

  if (!musicStore.genres?.length) {
    await musicStore.fetchGenres()
  }
  if (!musicStore.genreListens?.length) {
    await musicStore.fetchGenreListens()
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

    <template v-else-if="mode === 'albums'">
      <p v-if="albumsWithListens.length === 0">
        Todavía no hay álbumes con escuchas registradas.
      </p>

      <ul v-else class="items-list">
        <li
          v-for="album in albumsWithListens"
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
            <strong>{{ formatDuration(album.total_listens * album.duration_s) }}</strong>
          </div>
        </li>
      </ul>
    </template>

    <template v-else>
      <p v-if="genresWithListens.length === 0">
        Todavía no hay géneros con escuchas registradas.
      </p>

      <ul v-else class="items-list">
        <li
          v-for="genre in genresWithListens"
          :key="genre.id"
          class="item"
        >
          <div class="item-main">
            <span class="item-title">{{ genre.name }}</span>
          </div>
          <div class="item-metrics">
            Veces escuchadas:
            <strong>{{ genre.total_listens }}</strong>
          </div>
        </li>
      </ul>
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
  border-bottom: 1px solid rgba(255,255,255,0.1);
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
