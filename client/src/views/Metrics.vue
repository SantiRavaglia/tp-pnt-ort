<template>
  <section class="page">
    <h1>Estadísticas</h1>

    <!-- estados -->
    <div v-if="loading" class="state">Cargando métricas…</div>
    <div v-else-if="error" class="state error">⚠ {{ error }}</div>
    <div v-else>
      <!-- KPIs -->
      <div class="kpis">
        <div class="kpi">
          <div class="kpi-label">Favoritos totales</div>
          <div class="kpi-value">{{ kpis.total }}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Tracks favoritos</div>
          <div class="kpi-value">{{ kpis.countsByType.track }}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Álbumes favoritos</div>
          <div class="kpi-value">{{ kpis.countsByType.album }}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Artistas favoritos</div>
          <div class="kpi-value">{{ kpis.countsByType.artist }}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Última actividad</div>
          <div class="kpi-value small">{{ lastActivity }}</div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="charts">
        <ChartCard
          title="Top géneros (en favoritos)"
          type="bar"
          :data="genresData"
        />
        <ChartCard
          title="Distribución por tipo"
          type="doughnut"
          :data="typeData"
        />
        <ChartCard
          title="Evolución de favoritos (14 días)"
          type="line"
          :data="timeFavsData"
          :options="{ tension: .35 }"
        />
      </div>

      <!-- Comparativo búsquedas vs favoritos -->
      <div class="charts one">
        <ChartCard
          title="Búsquedas vs Favoritos (14 días)"
          type="line"
          :data="timeCompareData"
          :options="{
            tension:.35,
            plugins:{ legend:{ position:'bottom' } },
            interaction:{ mode:'index', intersect:false }
          }"
        />
      </div>

      <!-- Tabla -->
      <div class="table-card">
        <header class="table-head">
          <strong>Favoritos (detalle)</strong>
          <div class="filters">
            <select v-model="filterType">
              <option value="">Todos</option>
              <option value="track">Tracks</option>
              <option value="album">Álbumes</option>
              <option value="artist">Artistas</option>
            </select>
            <input v-model="q" placeholder="Buscar por nombre…" />
          </div>
        </header>

        <table>
          <thead>
            <tr>
              <th @click="sortBy('entityType')">Tipo</th>
              <th @click="sortBy('name')">Nombre</th>
              <th @click="sortBy('ts')">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in visibleRows" :key="row.id">
              <td class="type">{{ row.entityType }}</td>
              <td>{{ row.name }}</td>
              <td>{{ formatDate(row.ts) }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="visibleRows.length === 0" class="state empty">Sin resultados con los filtros actuales.</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChartCard from '../components/ChartCard.vue'
import dayjs from 'dayjs'
import {
  fetchCatalog,
  fetchFavoritesForUser,
  fetchSearchesForUser,
  computeKPIs,
  topGenres,
  timeSeriesByDay
} from '../services/metricsMock'

const loading = ref(true)
const error = ref('')
const catalog = ref(null)   
const favs = ref([])        
const searches = ref([])    
const kpis = ref({ total:0, countsByType:{ track:0, album:0, artist:0 }, lastTs:null })

const filterType = ref('')
const q = ref('')
const sortKey = ref('ts')
const sortDir = ref('desc')

onMounted(async () => {
  try {
    const [cat, userFavs, userSearches] = await Promise.all([
      fetchCatalog(),
      fetchFavoritesForUser(3),  
      fetchSearchesForUser(3)
    ])
    catalog.value = cat
    favs.value = userFavs
    searches.value = userSearches
    kpis.value = computeKPIs({ favs: favs.value })
  } catch (e) {
    error.value = e.message || 'Error cargando métricas'
  } finally {
    loading.value = false
  }
})

const lastActivity = computed(() =>
  kpis.value.lastTs ? dayjs(kpis.value.lastTs).format('DD/MM HH:mm') : '—'
)

const genresData = computed(() => {
  const top = topGenres({ favs: favs.value, trackMap: catalog.value?.byId.track || {} })
  return {
    labels: top.map(([g]) => g),
    datasets: [{ label: 'Favoritos', data: top.map(([,c]) => c) }]
  }
})

const typeData = computed(() => ({
  labels: ['Track', 'Álbum', 'Artista'],
  datasets: [{
    label: 'Por tipo',
    data: [
      kpis.value.countsByType.track,
      kpis.value.countsByType.album,
      kpis.value.countsByType.artist
    ]
  }]
}))

const timeFavsData = computed(() => {
  const s = timeSeriesByDay(favs.value, 14)
  return {
    labels: s.map(x => x.day.slice(5)), 
    datasets: [{ label:'Favs/día', data: s.map(x => x.count) }]
  }
})

const timeCompareData = computed(() => {
  const sFav = timeSeriesByDay(favs.value, 14)
  const sSea = timeSeriesByDay(searches.value, 14)
  const labels = sFav.map(x => x.day.slice(5))

  return {
    labels,
    datasets: [
      { label:'Búsquedas/día', data: sSea.map(x => x.count) },
      { label:'Favs/día',      data: sFav.map(x => x.count) }
    ]
  }
})

const rows = computed(() => favs.value.map(f => {
  const name =
    f.entityType === 'track'  ? catalog.value?.byId.track[f.entityId]?.title  :
    f.entityType === 'album'  ? catalog.value?.byId.album[f.entityId]?.name   :
    f.entityType === 'artist' ? catalog.value?.byId.artist[f.entityId]?.name  :
    String(f.entityId)
  return { ...f, name }
}))

const filtered = computed(() => rows.value.filter(r => {
  const okType = filterType.value ? r.entityType === filterType.value : true
  const okText = q.value ? r.name.toLowerCase().includes(q.value.toLowerCase()) : true
  return okType && okText
}))

const visibleRows = computed(() => {
  const list = filtered.value.slice()
  list.sort((a,b) => {
    const dir = sortDir.value === 'asc' ? 1 : -1
    const ka = a[sortKey.value] ?? ''
    const kb = b[sortKey.value] ?? ''
    return ka > kb ? dir : ka < kb ? -dir : 0
  })
  return list
})

function sortBy(k){
  if (sortKey.value === k) sortDir.value = (sortDir.value === 'asc' ? 'desc' : 'asc')
  else { sortKey.value = k; sortDir.value = 'asc' }
}

function formatDate(iso){ return dayjs(iso).format('DD/MM/YYYY HH:mm') }
</script>

<style scoped>
.page {
  padding: 1rem;
  color: #fff;
  overflow-x: hidden;
}

h1 {
  margin: 0.2rem 0 1rem;
}

.state {
  opacity: 0.85;
  padding: 0.8rem;
}
.state.error {
  color: #ff8f8f;
}
.state.empty {
  opacity: 0.7;
}

.kpis {
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 1.5rem;
}
.kpi {
  background: #0f141b;
  border: 1px solid #202632;
  border-radius: 12px;
  padding: 0.9rem;
  text-align: center;
}
.kpi-label {
  font-size: 0.85rem;
  opacity: 0.8;
  margin-bottom: 0.3rem;
}
.kpi-value {
  font-size: 1.4rem;
  font-weight: 700;
}
.kpi-value.small {
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
}

.charts {
  display: grid;
  gap: 1.2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: 1.5rem;
}
.charts.one {
  grid-template-columns: 1fr;
}

.card {
  background: #0f141b;
  border: 1px solid #202632;
  border-radius: 16px;
  padding: 1rem;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
}

.card canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.table-card {
  background: #0f141b;
  border: 1px solid #202632;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1.5rem;
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 0.9rem;
  border-bottom: 1px solid #202632;
  background: #10161f;
}

.filters {
  display: flex;
  gap: 0.5rem;
}
.filters input,
.filters select {
  background: #0b0f15;
  border: 1px solid #2a3240;
  color: #fff;
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 0.6rem 0.8rem;
  border-bottom: 1px solid #202632;
}
th {
  cursor: pointer;
  user-select: none;
  background: #0f141b;
}
td.type {
  text-transform: capitalize;
  opacity: 0.9;
}

@media (max-width: 1100px) {
  .charts {
    grid-template-columns: 1fr;
  }
  .kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
