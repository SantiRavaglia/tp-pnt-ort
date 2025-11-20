<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useMusicStore } from '../stores/musicStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  song: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      album_id: null,
      name: 'Canción desconocida',
      duration_s: 0,
      track_number: null
    })
  }
})

const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const musicStore = useMusicStore()
const { albums } = storeToRefs(musicStore)

const albumName = computed(() => {
  if (!albums.value?.length) return 'Álbum desconocido'
  const a = albums.value.find(a => a.id === props.song.album_id)
  return a ? a.album : 'Álbum desconocido'
})

const listens = computed(() => {
  if (!user.value) return null
  const match = musicStore.songListens.find(
    l => l.song_id === props.song.id && l.user_id === user.value.id
  )
  return match || null
})

const formattedDuration = computed(() => {
  const total = props.song.duration_s || 0
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
})

async function addTimesListened() {
  if (!isAuthenticated.value || !user.value) return
  await musicStore.incrementSongListen(props.song.id, user.value.id)
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ song.name }}</h3>
      <button class="add-btn" @click="addTimesListened">
        +
      </button>
    </div>

    <div class="details">
      <p>
        <strong>Álbum:</strong> {{ albumName }}
      </p>
      <p v-if="song.track_number != null">
        <strong>Pista:</strong> #{{ song.track_number }}
      </p>
      <p>
        <strong>Duración:</strong> {{ formattedDuration }}
      </p>
      <p>
        <strong>Veces escuchadas:</strong> {{ listens?.times_listened ?? 0 }}
      </p>
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
  font-size: 1.05rem;
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
