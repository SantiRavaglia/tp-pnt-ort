<script setup>
import { onMounted } from 'vue'
import SearchForm from '../components/SearchForm.vue'
import ResultsList from '../components/ResultsList.vue'
import { useMusicStore } from '../stores/musicStore'

const musicStore = useMusicStore()

onMounted(async () => {
  if (!musicStore.genres.length) {
    await musicStore.fetchGenres();
    await musicStore.fetchAlbums("", "artist");
  }
})
</script>

<template>
  <div class="container">
    <h1>🎶 Búsqueda de Discos</h1>
    
    <SearchForm />
    
    <ResultsList />
  </div>
</template>

<style scoped>
h1 {
    color: #eaedf0;
    margin-bottom: 30px;
}
</style>