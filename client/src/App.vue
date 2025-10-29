<script setup>
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="layout">
    <Sidebar />
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

