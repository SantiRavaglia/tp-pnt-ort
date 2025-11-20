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
  <!-- acá uso la clase que definiste en el CSS -->
  <form @submit.prevent="handleSubmit" class="search-form">

    <!-- Radios: Álbumes / Géneros -->
    <div class="search-entity-group">
      <label>
        <input
          type="radio"
          value="albums"
          v-model="searchEntity"
          name="search-entity"
        />
        Álbumes
      </label>

      <label>
        <input
          type="radio"
          value="genres"
          v-model="searchEntity"
          name="search-entity"
        />
        Géneros
      </label>
    </div>

    <!-- Input + botón, envueltos en .search-input-group -->
    <div class="search-input-group">
      <input 
        type="text" 
        v-model="localQuery" 
        :placeholder="isAlbumMode 
          ? 'Buscar por Artista, Álbum o Año...' 
          : 'Buscar por nombre de género...'"
        required
      />

      <button type="submit" :disabled="musicStore.isLoading || localQuery === ''">
        <span v-if="musicStore.isLoading">Buscando...</span>
        <span v-else>🔍 Buscar</span>
      </button>
    </div>

    <!-- Radios de tipo de búsqueda -->
    <div v-if="isAlbumMode" class="search-type-group">
      <label>
        <input 
          type="radio" 
          :checked="musicStore.searchType === 'artist'" 
          @change="updateSearchType('artist')"
          name="search-type"
        />
        Artista
      </label>

      <label>
        <input 
          type="radio" 
          :checked="musicStore.searchType === 'album'" 
          @change="updateSearchType('album')"
          name="search-type"
        />
        Nombre
      </label>

      <label>
        <input 
          type="radio" 
          :checked="musicStore.searchType === 'year'" 
          @change="updateSearchType('year')"
          name="search-type"
        />
        Año
      </label>
    </div>

  </form>
</template>


<style scoped>
.search-form {
  margin-bottom: 25px;
  padding: 20px;
  background: #111827;
  border-radius: 14px;
  border: 1px solid #1f2937;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* INPUT + BOTÓN */
.search-input-group {
  display: flex;
  gap: 12px;
  width: 100%;
}

.search-input-group input {
  flex-grow: 1;
  padding: 12px 16px;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 10px;
  color: #e5e7eb;
  font-size: 15px;
  transition: 0.2s;
}

.search-input-group input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 8px #6366f188;
}

.search-input-group button {
  padding: 12px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.search-input-group button:hover:not(:disabled) {
  background: #4338ca;
}

.search-input-group button:disabled {
  background: #6d6d6d;
  cursor: not-allowed;
}

/* RADIOS MODERNOS */
.search-type-group,
.search-entity-group {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-type-group label,
.search-entity-group label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 500;
  color: #e5e7eb;
  cursor: pointer;
}

/* radio base */
.search-type-group input[type="radio"],
.search-entity-group input[type="radio"] {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #6b7280;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: 0.2s;
}

/* hover */
.search-type-group input[type="radio"]:hover,
.search-entity-group input[type="radio"]:hover {
  border-color: #9ca3af;
}

/* círculo interno */
.search-type-group input[type="radio"]:checked::before,
.search-entity-group input[type="radio"]:checked::before {
  content: "";
  width: 10px;
  height: 10px;
  background: #6366f1;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
}
</style>

