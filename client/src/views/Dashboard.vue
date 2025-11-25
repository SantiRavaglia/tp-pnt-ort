<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMusicStore } from '../stores/musicStore'
import { useAuthStore } from '../stores/auth'
import { useHighlightsStore } from '../stores/highlights'

const musicStore = useMusicStore()
const authStore  = useAuthStore()
const highlights = useHighlightsStore()

const { isAdmin } = storeToRefs(authStore)

// 👇 Getters del store (ya reactivos)
const {
  topAlbums,
  topArtists,
  getAlbums,
  getGenres,
  getSongs,
  albumsWithListens,
  totalPlays,
  albumsWithListensCount,
  mostListenedGenre,
  mostListenedArtist
} = storeToRefs(musicStore)

onMounted(async () => {
  // Álbumes + escuchas
  await getGenres.value;
  await getAlbums.value;
  await getSongs.value;
  if (!musicStore.albumListens.length) {
    await musicStore.fetchAlbumListens()
  }
  if (!musicStore.genreListens.length) {
    await musicStore.fetchGenreListens()
  }
})

function toggleAlbumHighlight(id) {
  if (!isAdmin.value) return
  highlights.toggleAlbum(id)
}

function toggleArtistHighlight(name) {
  if (!isAdmin.value) return
  highlights.toggleArtist(name)
}
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <div>
        <h1>Resumen global de escuchas</h1>
        <p class="subtitle">
          Estadísticas armadas a partir de todos los usuarios del sistema.
        </p>
      </div>
      <div v-if="isAdmin" class="role-chip">Vista admin</div>
      <div v-else class="role-chip role-chip--user">Vista usuario</div>
    </header>

    <!-- KPIs -->
    <section class="kpis">
      <div class="kpi-card">
        <div class="kpi-label">Reproducciones totales</div>
        <div class="kpi-value">{{ totalPlays }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">Álbumes con escuchas</div>
        <div class="kpi-value">{{ albumsWithListensCount }}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">Género más escuchado</div>
        <div class="kpi-value">
          {{ mostListenedGenre?.name || '—' }}
        </div>
        <div class="kpi-sub">
          {{ mostListenedGenre?.total_listens || 0 }} reproducciones
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">Artista más escuchado</div>
        <div class="kpi-value">
          {{ mostListenedArtist?.name || '—' }}
        </div>
        <div class="kpi-sub">
          {{ mostListenedArtist?.total_listens || 0 }} reproducciones
        </div>
      </div>
    </section>

    <section class="grid">
      <!-- Top 5 álbumes -->
      <article class="panel">
        <div class="panel-header">
          <h2>Top 5 álbumes</h2>
          <span class="panel-sub">Ordenados por escuchas totales</span>
        </div>

        <ul class="list">
          <li
            v-for="(album, index) in topAlbums"
            :key="album.id"
            class="list-item"
            :class="{ highlighted: highlights.isAlbumHighlighted(album.id) }"
          >
            <div class="rank">#{{ index + 1 }}</div>

            <div class="item-main">
              <div class="item-title">
                {{ album.artist }} — {{ album.album }}
              </div>
              <div class="item-meta">
                Año {{ album.year }} · {{ album.total_listens }} escuchas
              </div>
            </div>

            <button
              v-if="isAdmin"
              class="badge-btn"
              @click="toggleAlbumHighlight(album.id)"
            >
              <span v-if="highlights.isAlbumHighlighted(album.id)">★ Quitar</span>
              <span v-else>☆ Recomendar</span>
            </button>

            <span
              v-else-if="highlights.isAlbumHighlighted(album.id)"
              class="pill pill--recommended"
            >
              Recomendado
            </span>
          </li>
        </ul>
      </article>

      <!-- Top 5 artistas -->
      <article class="panel">
        <div class="panel-header">
          <h2>Top 5 artistas</h2>
          <span class="panel-sub">Sumando escuchas de todos sus álbumes</span>
        </div>

        <ul class="list">
          <li
            v-for="(artist, index) in topArtists"
            :key="artist.name"
            class="list-item"
            :class="{ highlighted: highlights.isArtistHighlighted(artist.name) }"
          >
            <div class="rank">#{{ index + 1 }}</div>

            <div class="item-main">
              <div class="item-title">{{ artist.name }}</div>
              <div class="item-meta">
                {{ artist.total_listens }} escuchas totales
              </div>
            </div>

            <button
              v-if="isAdmin"
              class="badge-btn"
              @click="toggleArtistHighlight(artist.name)"
            >
              <span v-if="highlights.isArtistHighlighted(artist.name)">★ Quitar</span>
              <span v-else>☆ Recomendar</span>
            </button>

            <span
              v-else-if="highlights.isArtistHighlighted(artist.name)"
              class="pill pill--recommended"
            >
              Recomendado
            </span>
          </li>
        </ul>
      </article>
    </section>

    <section class="note">
      <p>
        Tus estadísticas personales están en la vista
        <strong>/estadisticas</strong>.
      </p>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
  color: #e5ecff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
}

.subtitle {
  opacity: 0.8;
  margin-top: 4px;
  font-size: 0.9rem;
}

.role-chip {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #4f46e5;
  font-size: 0.8rem;
}

.role-chip--user {
  border-color: #38bdf8;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.kpi-card {
  background: #020617;
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.kpi-label {
  font-size: 0.78rem;
  opacity: 0.8;
}

.kpi-value {
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 4px;
}

.kpi-sub {
  font-size: 0.8rem;
  margin-top: 2px;
  opacity: 0.85;
}

.grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.panel {
  background: #020617;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  padding: 14px;
}

.panel-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.panel-sub {
  font-size: 0.8rem;
  opacity: 0.8;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.9);
}

.list-item:last-child {
  border-bottom: none;
}

.list-item.highlighted {
  background: linear-gradient(90deg, rgba(250, 204, 21, 0.08), transparent);
}

.rank {
  font-weight: 700;
  width: 26px;
  text-align: center;
  opacity: 0.9;
}

.item-main {
  min-width: 0;
}

.item-title {
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 2px;
}

.badge-btn {
  border-radius: 999px;
  border: 1px solid rgba(250, 204, 21, 0.7);
  background: transparent;
  color: #facc15;
  font-size: 0.78rem;
  padding: 4px 10px;
  cursor: pointer;
}

.badge-btn:hover {
  background: rgba(250, 204, 21, 0.12);
}

.pill {
  border-radius: 999px;
  font-size: 0.78rem;
  padding: 3px 8px;
}

.pill--recommended {
  background: rgba(250, 204, 21, 0.12);
  color: #facc15;
  border: 1px solid rgba(250, 204, 21, 0.7);
}

.note {
  margin-top: 18px;
  font-size: 0.85rem;
  opacity: 0.85;
}
</style>
