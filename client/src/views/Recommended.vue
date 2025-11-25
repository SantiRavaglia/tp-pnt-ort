<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMusicStore } from '../stores/musicStore'
import { useAuthStore } from '../stores/auth'
import { useHighlightsStore } from '../stores/highlights'

const musicStore = useMusicStore()
const authStore  = useAuthStore()
const highlights = useHighlightsStore()

const { isAdmin } = storeToRefs(authStore)
const { albums, albumsWithListens, getAlbums, getGenres, getSongs } = storeToRefs(musicStore)

// búsquedas para la parte de "Agregar"
const albumSearch  = ref('')
const artistSearch = ref('')

// Cargar datos
onMounted(async () => {
  await getGenres.value
  await getAlbums.value
  await getSongs.value

  if (!musicStore.albumListens.length) {
    await musicStore.fetchAlbumListens()
  }
  if (!musicStore.genreListens.length) {
    await musicStore.fetchGenreListens()
  }
})

// --- RECOMENDADOS ACTUALES ---
// Todos los álbumes del catálogo, con total_listens (0 si nunca se escuchó)
const allAlbums = computed(() => {
  const listensById = new Map(
    albumsWithListens.value.map(a => [a.id, a.total_listens])
  )

  return albums.value.map(a => ({
    ...a,
    total_listens: listensById.get(a.id) ?? 0
  }))
})

// Todos los artistas del catálogo con suma de escuchas de sus álbumes
const allArtists = computed(() => {
  const map = new Map()

  for (const album of allAlbums.value) {
    const prev = map.get(album.artist) ?? 0
    map.set(album.artist, prev + album.total_listens)
  }

  return Array.from(map, ([name, total_listens]) => ({ name, total_listens }))
})


const recommendedAlbums = computed(() =>
  allAlbums.value
    .filter(a => highlights.isAlbumHighlighted(a.id))
    .sort((a, b) => b.total_listens - a.total_listens)
)

const recommendedArtists = computed(() =>
  allArtists.value
    .filter(a => highlights.isArtistHighlighted(a.name))
    .sort((a, b) => b.total_listens - a.total_listens)
)

// --- LISTAS PARA AGREGAR (ORDENADAS + FILTRADAS) ---

const availableAlbums = computed(() => {
  const q = albumSearch.value.trim().toLowerCase()

  return allAlbums.value
    .filter(a => !highlights.isAlbumHighlighted(a.id))
    .filter(a => {
      if (!q) return true
      return (
        a.album.toLowerCase().includes(q) ||
        a.artist.toLowerCase().includes(q) ||
        String(a.year).includes(q)
      )
    })
    .sort((a, b) => b.total_listens - a.total_listens)
})

const availableArtists = computed(() => {
  const q = artistSearch.value.trim().toLowerCase()

  return allArtists.value
    .filter(a => !highlights.isArtistHighlighted(a.name))
    .filter(a => (!q ? true : a.name.toLowerCase().includes(q)))
    .sort((a, b) => b.total_listens - a.total_listens)
})

// acciones
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
  <div class="reco-page">
    <header class="reco-header">
      <div>
        <h1>Recomendados</h1>
        <p class="subtitle">
          Álbumes y artistas destacados por el administrador.
        </p>
      </div>

      <div v-if="isAdmin" class="role-chip">Vista admin</div>
      <div v-else class="role-chip role-chip--user">Vista usuario</div>
    </header>

    <!-- BLOQUE SUPERIOR: LO QUE YA ESTÁ RECOMENDADO -->
    <section class="reco-grid">
      <!-- Álbumes recomendados -->
      <article class="panel">
        <div class="panel-header">
          <h2>Álbumes recomendados</h2>
          <span class="panel-sub">Seleccionados por el administrador</span>
        </div>

        <ul class="reco-list">
          <li
            v-for="album in recommendedAlbums"
            :key="album.id"
            class="reco-item"
          >
            <div class="reco-item-main">
              <span class="reco-icon">♪</span>
              <div class="reco-text">
                <div class="reco-title">
                  {{ album.artist }} — {{ album.album }}
                </div>
                <div class="reco-meta">
                  Año {{ album.year }} · {{ album.total_listens }} escuchas
                </div>
              </div>
            </div>

            <button
              v-if="isAdmin"
              class="reco-btn reco-btn--outline"
              @click="toggleAlbumHighlight(album.id)"
            >
              Quitar
            </button>
          </li>
          <li v-if="!recommendedAlbums.length" class="reco-empty">
            No hay álbumes recomendados todavía.
          </li>
        </ul>
      </article>

      <!-- Artistas recomendados -->
      <article class="panel">
        <div class="panel-header">
          <h2>Artistas recomendados</h2>
          <span class="panel-sub">Ordenados por escuchas totales</span>
        </div>

        <ul class="reco-list">
          <li
            v-for="artist in recommendedArtists"
            :key="artist.name"
            class="reco-item"
          >
            <div class="reco-item-main">
              <span class="reco-icon">★</span>
              <div class="reco-text">
                <div class="reco-title">{{ artist.name }}</div>
                <div class="reco-meta">
                  {{ artist.total_listens }} escuchas totales
                </div>
              </div>
            </div>

            <button
              v-if="isAdmin"
              class="reco-btn reco-btn--outline"
              @click="toggleArtistHighlight(artist.name)"
            >
              Quitar
            </button>
          </li>
          <li v-if="!recommendedArtists.length" class="reco-empty">
            No hay artistas recomendados todavía.
          </li>
        </ul>
      </article>
    </section>

    <!-- BLOQUE INFERIOR: AGREGAR NUEVOS RECOMENDADOS (SOLO ADMIN) -->
    <section v-if="isAdmin" class="reco-add-grid">
      <!-- Álbumes -->
      <article class="panel">
        <div class="panel-header">
          <h2>Agregar álbumes recomendados</h2>
        </div>

        <div class="search-wrapper">
          <label class="search-label">Buscá por nombre, artista o año</label>
          <input
            v-model="albumSearch"
            type="text"
            class="search-input"
            placeholder="Buscar álbum..."
          />
        </div>

        <div class="reco-add-list">
          <div
            v-for="album in availableAlbums"
            :key="album.id"
            class="reco-add-item"
          >
            <div class="reco-text">
              <div class="reco-title">
                {{ album.artist }} — {{ album.album }}
              </div>
              <div class="reco-meta">
                Año {{ album.year }} · {{ album.total_listens }} escuchas
              </div>
            </div>

            <button
              class="reco-btn reco-btn--ghost"
              @click="toggleAlbumHighlight(album.id)"
            >
              ☆ Recomendar
            </button>
          </div>

          <p v-if="!availableAlbums.length" class="reco-empty">
            No hay álbumes para mostrar con ese filtro.
          </p>
        </div>
      </article>

      <!-- Artistas -->
      <article class="panel">
        <div class="panel-header">
          <h2>Agregar artistas recomendados</h2>
        </div>

        <div class="search-wrapper">
          <label class="search-label">Buscá por nombre</label>
          <input
            v-model="artistSearch"
            type="text"
            class="search-input"
            placeholder="Buscar artista..."
          />
        </div>

        <div class="reco-add-list">
          <div
            v-for="artist in availableArtists"
            :key="artist.name"
            class="reco-add-item"
          >
            <div class="reco-text">
              <div class="reco-title">{{ artist.name }}</div>
              <div class="reco-meta">
                {{ artist.total_listens }} escuchas totales
              </div>
            </div>

            <button
              class="reco-btn reco-btn--ghost"
              @click="toggleArtistHighlight(artist.name)"
            >
              ☆ Recomendar
            </button>
          </div>

          <p v-if="!availableArtists.length" class="reco-empty">
            No hay artistas para mostrar con ese filtro.
          </p>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.reco-page {
  padding: 20px;
  color: #e5ecff;
}

/* Header */
.reco-header {
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

/* Panels superiores */
.reco-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}
@media (max-width: 980px) {
  .reco-grid {
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

/* Listado de recomendados */
.reco-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.reco-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.9);
}
.reco-item:last-child {
  border-bottom: none;
}
.reco-item-main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.reco-icon {
  font-size: 1rem;
  opacity: 0.85;
}
.reco-text {
  min-width: 0;
}
.reco-title {
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
}
.reco-meta {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 2px;
}
.reco-empty {
  font-size: 0.85rem;
  opacity: 0.75;
  padding: 8px 0;
}

/* Botones genéricos de esta vista */
.reco-btn {
  border-radius: 999px;
  font-size: 0.78rem;
  padding: 4px 12px;
  cursor: pointer;
  white-space: nowrap;
}
.reco-btn--outline {
  border: 1px solid rgba(250, 204, 21, 0.7);
  background: transparent;
  color: #facc15;
}
.reco-btn--outline:hover {
  background: rgba(250, 204, 21, 0.12);
}
.reco-btn--ghost {
  border: 1px solid rgba(250, 204, 21, 0.4);
  background: #020617;
  color: #facc15;
}
.reco-btn--ghost:hover {
  background: rgba(250, 204, 21, 0.14);
}

/* Sección inferior “Agregar” */
.reco-add-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
}
@media (max-width: 980px) {
  .reco-add-grid {
    grid-template-columns: 1fr;
  }
}

.search-wrapper {
  margin-bottom: 8px;
}
.search-label {
  display: block;
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 6px;
  margin-left: 6px;
}
.search-input {
  width: 100%;
  max-width: 95%;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: #020617;
  color: #e5ecff;
  font-size: 0.9rem;
  margin-bottom: 12px;
  
}

/* Lista scrollable solo en la parte inferior */
.reco-add-list {
  margin-top: 8px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
}

/* Scrollbar finito */
.reco-add-list::-webkit-scrollbar {
  width: 6px;
}
.reco-add-list::-webkit-scrollbar-track {
  background: transparent;
}
.reco-add-list::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.5);
  border-radius: 999px;
}
.reco-add-list::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.8);
}

.reco-add-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.9);
}
.reco-add-item:last-child {
  border-bottom: none;
}
</style>
