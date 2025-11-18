<script setup>
import { storeToRefs } from 'pinia';
import { useMusicStore } from '../stores/musicStore';
import AlbumCard from './AlbumCard.vue';

const musicStore = useMusicStore();

const { searchResults, isLoading, error, searchQuery, searchType, albumListens } = storeToRefs(musicStore);
</script>

<template>
  <div class="results-container">
    <h2>Resultados de Búsqueda</h2>

    <div v-if="isLoading" class="status-message loading">
      Cargando resultados para '{{ searchQuery }}' por {{ searchType }}...
    </div>

    <div v-else-if="error" class="status-message error">
      ⚠️ Error: {{ error }}
    </div>

    <div v-else-if="searchResults.length > 0">
      <p class="summary-text">Se encontraron **{{ searchResults.length }}** discos.</p>
      
      <div class="cards-grid">
        <AlbumCard 
          v-for="album in searchResults" 
          :key="album.id" 
          :album="album" 
        />
      </div>
    </div>
    
    <div v-else-if="searchQuery" class="status-message no-results">
      No se encontraron resultados para **'{{ searchQuery }}'** en la búsqueda por **{{ searchType }}**.
    </div>
    
    <div v-else class="status-message initial">
      Utiliza el formulario superior para buscar discos musicales.
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Diseño adaptable */
  gap: 20px;
}
</style>