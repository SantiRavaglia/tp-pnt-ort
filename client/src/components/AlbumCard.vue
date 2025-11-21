<script setup>
import { defineProps, computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { storeToRefs } from 'pinia'
import { useMusicStore } from '../stores/musicStore'

const props = defineProps({
  album: {
    type: Object,
    required: true,
    default: () => ({ 
      id: 0,
      artist: 'Artista Desconocido', 
      album: 'Título Desconocido', 
      year: 'Año Desconocido',
      duration_s: 0,
      genre_id: null
    })
  }
})

const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const musicStore = useMusicStore()
const { genres } = storeToRefs(musicStore)

const genreName = computed(() => {
  const gId = props.album.genre_id
  if (!gId) return 'Género desconocido'

  const g = genres.value.find(g => g.id === gId)
  return g ? g.name : 'Género desconocido'
})

const listens = computed(() => {
  const u = user.value
  if (!u) return null

  const arr = musicStore.albumListens || []
  return (
    arr.find(
      (l) => l.album_id === props.album.id && l.user_id === u.id
    ) || null
  )
})

async function addTimesListened() {
  if (!isAuthenticated.value || !user.value) return
  await musicStore.incrementAlbumListen(props.album.id, user.value.id)
}
</script>

<template>
  <div class="card">

    <div class="card-header">
      <h3>{{ album.artist }}</h3>
      <button class="add-btn" @click="addTimesListened()">+</button>
    </div>

    <div class="details">
      <p>
        <strong>Álbum:</strong> {{ album.album }}
      </p>
      <p>
        <strong>Lanzamiento:</strong> {{ album.year }}
      </p>
      <p>
        <strong>Género:</strong> {{ genreName }}
      </p>
      <p>
        <strong>Escuchado:</strong> {{ listens?.times_listened ?? 0 }}
      </p>
      <router-link :to="`/album/${album.id}`" class="view-songs-btn"> Ver canciones </router-link>
    </div>

  </div>
</template>

<style scoped>
.card {
  background: #0f1624;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
.view-songs-btn {
  display: inline-block;
  margin-top: 8px;
  padding: 6px 12px;
  background: #1e40af; /* azul más brillante */
  color: #fff;
  border-radius: 8px;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.15s ease, transform 0.12s ease;
}

.view-songs-btn:hover {
  background: #3b82f6; /* un celeste más moderno */
  transform: translateY(-1px);
}


.card-header {
  display: flex;
  justify-content: space-between; 
  align-items: center;            
  margin-bottom: 10px;
  border-bottom: 1px solid #eee3;
  padding-bottom: 5px;
}

h3 {
  color: #e4d9d9;
  margin: 0;
}

.add-btn {
  background: #ffffff22;
  color: #fff;
  border: 1px solid #ffffff55;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.15s ease;
}

.add-btn:hover {
  background: #ffffff44;
}

.details p {
  margin: 6px 0;
  color: #e4d9d9;
}

.details strong {
  color: #007bff;
}

</style>
