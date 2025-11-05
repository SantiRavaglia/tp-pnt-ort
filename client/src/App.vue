<script setup>
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="layout">
    <Sidebar />
    <div class="main">
      <Router-view />
    </div>
  </div>
</template>

