<script setup>
import SearchForm from '../components/SearchForm.vue'
import ResultsList from '../components/ResultsList.vue'
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