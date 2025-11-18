<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMusicStore } from '../stores/musicStore'

const musicStore = useMusicStore()
const { albumsWithListens, isLoading } = storeToRefs(musicStore)

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

onMounted(async () => {
  if (!musicStore.allAlbums.length) {
    await musicStore.fetchAlbums('', 'artist')
  }
  if (!musicStore.albumListens.length) {
    await musicStore.fetchAlbumListens()
  }
})
</script>

<template>
  <div class="albums-listened-view">
    <h2>Álbumes escuchados</h2>

    <p v-if="isLoading">Cargando datos...</p>

    <template v-else>
      <p v-if="albumsWithListens.length === 0">
        Todavía no hay álbumes con escuchas registradas.
      </p>

      <ul v-else class="albums-list">
        <li
          v-for="album in albumsWithListens"
          :key="album.id"
          class="album-item"
        >
          <div class="album-main">
            <span class="album-title">{{ album.artist }} — {{ album.album }}</span>
            <span class="album-year">({{ album.year }})</span>
          </div>
          <div class="album-metrics">
            Tiempo escuchado: <strong>{{ formatDuration(album.total_listens * album.duration_s)}}</strong>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.albums-listened-view {
  padding: 20px;
}

.albums-list {
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
}

.album-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
}

.album-main {
  font-size: 1rem;
}

.album-title {
  font-weight: 600;
}

.album-year {
  margin-left: 4px;
  opacity: 0.8;
}

.album-metrics {
  font-size: 0.9rem;
  margin-top: 4px;
  color: #a0c4ff;
}
</style>
