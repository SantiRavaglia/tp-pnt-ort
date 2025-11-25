<script setup>
import { computed } from 'vue'
import { useMusicStore } from '../stores/musicStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  song: {
    type: Object,
    required: true
  }
})

const musicStore = useMusicStore()
const { albums } = storeToRefs(musicStore)

const albumName = computed(() => {
  if (!albums.value?.length) return 'Álbum desconocido'

  const albumId = props.song.album_id ?? props.song.albumId
  const a = albums.value.find(a => a.id === albumId)

  return a ? a.album : 'Álbum desconocido'
})

const songTitle = computed(() => {
  return (
    props.song.name
  )
})

const formattedDuration = computed(() => {
  const durSeconds = props.song.duration_s ?? props.song.durationSeconds

  if (typeof durSeconds === 'number' && durSeconds > 0) {
    const m = Math.floor(durSeconds / 60)
    const s = durSeconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  if (typeof props.song.duration === 'string' && props.song.duration.trim() !== '') {
    return props.song.duration
  }

  return '—'
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ songTitle }}</h3>
    </div>

    <div class="details">
      <p>
        <strong>Álbum:</strong> {{ albumName }}
      </p>
      <p v-if="song.track_number != null || song.trackNumber != null">
        <strong>Pista:</strong> #{{ song.track_number ?? song.trackNumber }}
      </p>
      <p>
        <strong>Duración:</strong> {{ formattedDuration }}
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

.details p {
  margin: 6px 0;
  color: #e4d9d9;
}

.details strong {
  color: #007bff;
}
</style>
