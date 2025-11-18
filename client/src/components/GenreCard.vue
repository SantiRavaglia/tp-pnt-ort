<script setup>
import { defineProps, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useMusicStore } from '../stores/musicStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  genre: {
    type: Object,
    required: true,
    default: () => ({ id: 0, name: 'Género desconocido' })
  }
})

const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const musicStore = useMusicStore()

const listens = computed(() => {
  const u = user.value
  if (!u) return null
  const arr = musicStore.genreListens || []
  return (
    arr.find(
      l => (l.genre_id ?? l.genreId) === props.genre.id && l.user_id === u.id
    ) || null
  )
})

async function addGenreListen() {
  if (!isAuthenticated.value || !user.value) return
  await musicStore.incrementGenreListen(props.genre.id, user.value.id)
}
</script>

<template>
  <div class="card">
    <h3>{{ genre.name }}</h3>
    <button @click="addGenreListen">+</button>

    <p>
      <strong>Veces escuchadas (vos):</strong>
      {{ listens?.times_listened ?? 0 }}
    </p>
  </div>
</template>
