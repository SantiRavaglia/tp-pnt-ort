<script setup>
import { useRoute } from 'vue-router'
import { useMusicStore } from '../stores/musicStore'
import { storeToRefs } from 'pinia'
import SongCard from '../components/SongCard.vue'

const route = useRoute()
const musicStore = useMusicStore()

const songs = computed(() => 
  musicStore.allSongs.filter(s => s.album_id == route.params.id)
)
</script>

<template>
  <div>
    <h2>Canciones del álbum</h2>

    <SongCard v-for="song in songs" :song="song" :key="song.id" />
  </div>
</template>