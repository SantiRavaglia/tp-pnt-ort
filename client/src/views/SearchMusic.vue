<script setup>
import { onMounted } from 'vue'
import SearchForm from '../components/SearchForm.vue'
import ResultsList from '../components/ResultsList.vue'
import { useMusicStore } from '../stores/musicStore'
import { storeToRefs } from 'pinia'

const musicStore = useMusicStore()
const { getAlbums, getSongs, getGenres } = storeToRefs(musicStore)

onMounted(async () => {
    await getGenres.value;
    await getAlbums.value;
    await getSongs.value;
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