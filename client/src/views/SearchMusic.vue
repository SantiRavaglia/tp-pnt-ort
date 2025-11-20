<script setup>
import { onMounted } from 'vue'
import SearchForm from '../components/SearchForm.vue'
import ResultsList from '../components/ResultsList.vue'
import { useMusicStore } from '../stores/musicStore'
import { storeToRefs } from 'pinia'

const musicStore = useMusicStore()
const { getAlbums } = storeToRefs(musicStore)

onMounted(async () => {
  if (!musicStore.genres.length) {
    await musicStore.fetchGenres();
    await getAlbums.value;
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