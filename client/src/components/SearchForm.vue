<script setup>
import { ref } from 'vue'
import { useMusicStore } from '../stores/musicStore'

const musicStore = useMusicStore()
const localQuery = ref(musicStore.searchQuery || '')
musicStore.fetchAlbumListens();

const handleSubmit = () => {
  if (localQuery.value.trim() === '') return
  
  musicStore.fetchAlbums(localQuery.value, musicStore.searchType);
console.log(musicStore.albumListens);
}

const updateSearchType = (type) => {
  musicStore.setSearchType(type)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="card">
    
    <div class="card" style="margin-bottom:16px">
      <input 
        type="text" 
        v-model="localQuery" 
        placeholder="Buscar por Artista, Álbum o Año..."
        required
      >
      <button type="submit" :disabled="musicStore.isLoading || localQuery === ''">
        <span v-if="musicStore.isLoading">Buscando...</span>
        <span v-else>🔍 Buscar</span>
      </button>
      
      <!-- <div class="card" style="margin-bottom:16px"> -->
        <label>
          <input 
          type="radio" 
          :checked="musicStore.searchType === 'artist'" 
          @change="updateSearchType('artist')"
          name="search-type"
          > Artista
        </label>
        <label>
          <input 
          type="radio" 
          :checked="musicStore.searchType === 'album'" 
          @change="updateSearchType('album')"
          name="search-type"
          > Nombre
        </label>
        <label>
          <input 
          type="radio" 
          :checked="musicStore.searchType === 'year'" 
          @change="updateSearchType('year')"
          name="search-type"
          > Año
        </label>
      <!-- </div> -->
    </div>
    
  </form>
</template>

<style scoped>
.search-form {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.search-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-input-group input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.search-input-group button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-input-group button:hover:not(:disabled) {
  background-color: #0056b3;
}

.search-input-group button:disabled {
  background-color: #a0c3e7;
  cursor: not-allowed;
}

.search-type-group label {
  margin-right: 15px;
  font-weight: 500;
}
</style>