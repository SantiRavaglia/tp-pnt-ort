<script setup>
import { storeToRefs } from 'pinia'
import { useMusicStore } from '../stores/musicStore'
import AlbumCard from './AlbumCard.vue'
import SongCard from './SongCard.vue'

const musicStore = useMusicStore()
const { 
  searchResults, 
  isLoading, 
  error, 
  searchQuery, 
  searchEntity
} = storeToRefs(musicStore)
</script>

<template>
  <div class="results-container">
    <h2>Resultados de Búsqueda</h2>

    <div v-if="isLoading" class="status-message loading">
      Cargando resultados para '{{ searchQuery }}' 
      <span v-if="searchEntity === 'albums'"> en albumes...</span>
      <span v-else-if="searchEntity === 'genres'"> en géneros...</span>
      <span v-else> en canciones...</span>
    </div>

    <div v-else-if="error" class="status-message error">
      ⚠️ Error: {{ error }}
    </div>

    <div v-else-if="searchResults.length > 0">
      <p class="summary-text">
        Se encontraron 
        <strong>{{ searchResults.length }}</strong>
        {{
          searchEntity === 'albums' ? 'discos' :
          searchEntity === 'genres' ? 'géneros' :
          'canciones'
        }}.
      </p>

      <div v-if="searchEntity === 'albums'" class="cards-grid">
        <AlbumCard 
          v-for="album in searchResults" 
          :key="album.id" 
          :album="album" 
        />
      </div>

      <ul v-else-if="searchEntity === 'genres'" class="genres-list">
        <li 
          v-for="genre in searchResults"
          :key="genre.id"
          class="genre-item"
        >
          {{ genre.name }}
        </li>
      </ul>

      <div v-else class="cards-grid">
        <SongCard 
          v-for="song in searchResults"
          :key="song.id"
          :song="song"
        />
      </div>

    </div>

    <div v-else-if="searchQuery" class="status-message no-results">
      No se encontraron resultados para 
      <strong>'{{ searchQuery }}'</strong>
      en 
      <strong>
        {{
          searchEntity === 'albums' ? 'albumes' :
          searchEntity === 'genres' ? 'género' :
          'canción'
        }}
      </strong>.
    </div>

    <div v-else class="status-message initial">
      Utiliza el formulario superior para buscar 
      {{
        searchEntity === 'albums'
          ? 'discos musicales'
          : searchEntity === 'genres'
            ? 'géneros musicales'
            : 'canciones'
      }}.
    </div>

  </div>
</template>


<style scoped>
.results-container {
  margin-top: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #007bff;
}

.status-message {
  padding: 15px;
  border-radius: 4px;
  text-align: center;
}

.loading {
  background-color: #e9f0ff;
  color: #007bff;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.no-results {
  background-color: #fff3cd;
  color: #856404;
}

.initial {
  background-color: #e2e3e5;
  color: #383d41;
}

.summary-text {
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.genres-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.genre-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
</style>
