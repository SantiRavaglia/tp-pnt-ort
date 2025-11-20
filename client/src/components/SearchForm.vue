<script setup>
import { ref, computed } from 'vue'
import { useMusicStore } from '../stores/musicStore'

const musicStore = useMusicStore()
const localQuery = ref(musicStore.searchQuery || '')

const searchEntity = computed({
  get: () => musicStore.searchEntity,
  set: (val) => musicStore.setSearchEntity(val)
})

const isAlbumMode = computed(() => searchEntity.value === 'albums')

musicStore.fetchAlbumListens()

const handleSubmit = async () => {
  if (localQuery.value.trim() === '') return
  
  if (searchEntity.value === 'albums') {
    await musicStore.fetchAlbums(localQuery.value, musicStore.searchType)
  } else {
    await musicStore.searchGenres(localQuery.value)
  }
}

const updateSearchType = (type) => {
  musicStore.setSearchType(type)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="card">
    <div class="card" style="margin-bottom:16px">
      <div style="margin-bottom: 8px;">
        <label>
          <input
            type="radio"
            value="albums"
            v-model="searchEntity"
            name="search-entity"
          />
          Álbumes
        </label>
        <label style="margin-left: 12px;">
          <input
            type="radio"
            value="genres"
            v-model="searchEntity"
            name="search-entity"
          />
          Géneros
        </label>
      </div>

      <input 
        type="text" 
        v-model="localQuery" 
        :placeholder="isAlbumMode 
          ? 'Buscar por Artista, Álbum o Año...' 
          : 'Buscar por nombre de género...'"
        required
      >
      <button type="submit" :disabled="musicStore.isLoading || localQuery === ''">
        <span v-if="musicStore.isLoading">Buscando...</span>
        <span v-else>🔍 Buscar</span>
      </button>
      
      <div v-if="isAlbumMode" style="margin-top: 8px;">
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
      </div>
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
