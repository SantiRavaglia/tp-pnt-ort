<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserMetricsStore } from '../stores/userMetrics'
import ChartCard from '../components/ChartCard.vue'

const store = useUserMetricsStore()
onMounted(() => { store.ensureDemoLoaded?.() })

// ---------- Helpers ----------
const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
function formatDayLabel(iso) {               
  const [y,m,d] = iso.split('-')
  return `${d}-${m}`
}
function monthNameEs(ym) {                   
  const date = new Date(`${ym}-01T00:00:00`)
  const name = date.toLocaleDateString('es-AR', { month: 'long' })
  return capitalize(name)
}

// ------------------- Tendencia (base diaria) -------------------
const tendenciaLista = computed(() => {
  const entries = Object.entries(store.tendenciaPorDia || {})
  entries.sort((a,b)=> a[0].localeCompare(b[0])) 
  return entries
})

// Agregación SOLO para el gráfico
const agg = ref('daily') // 'daily' | 'monthly'

// Agrupado mensual (para el gráfico)
const tendenciaMensual = computed(() => {
  const buckets = {}
  for (const [day, count] of tendenciaLista.value) {
    const month = day.slice(0,7) 
    buckets[month] = (buckets[month] || 0) + count
  }
  return Object.entries(buckets).sort((a,b)=> a[0].localeCompare(b[0]))
})

// Labels y datos del bar chart según agregación
const barLabels = computed(() =>
  agg.value === 'daily'
    ? tendenciaLista.value.map(([d]) => formatDayLabel(d))  
    : tendenciaMensual.value.map(([m]) => monthNameEs(m))   
)

const barSeries = computed(() =>
  agg.value === 'daily'
    ? tendenciaLista.value.map(([_, c]) => c)
    : tendenciaMensual.value.map(([_, c]) => c)
)

const barData = computed(() => ({
  labels: barLabels.value,
  datasets: [{
    label: 'Reproducciones',
    data: barSeries.value,
    borderWidth: 1
  }]
}))

const xTitle = computed(() => agg.value === 'daily' ? 'Día' : 'Mes')

// Opciones del chart 
const barOptions = computed(() => ({
  plugins: { legend: { display:false }, tooltip:{ enabled:true } },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero:true, ticks:{ precision:0 } },
    x: {
      title: { display:true, text: xTitle.value, color:'#cfd8e3' },
      ticks: { color:'#cfd8e3', maxRotation: 0, minRotation: 0, autoSkip: true }
    }
  }
}))

// ------------------- Rango rápido (toolbar) -------------------
function setRange(days) {
  const now = new Date()
  const start = new Date(now)
  start.setDate(start.getDate() - days)
  store.setRange({ start, end: now })
}
function setHistorical() { store.clearRange() }

// ------------------- Distribución por canción -------------------
const distRows = computed(() => {
  if (Array.isArray(store.topCanciones) && store.topCanciones.length) {
    return store.topCanciones.map(t => ({
      trackId: t.id ?? t.trackId,
      name: t.title ?? t.name,
      count: t.count
    }))
  }
  const byId = store.mapTrackById || {}
  const src = Array.isArray(store.distribucionPorCancion) ? store.distribucionPorCancion : []
  return src.map(r => ({
    trackId: r.trackId,
    name: byId[r.trackId]?.title || byId[r.trackId]?.name || `#${r.trackId}`,
    count: r.count
  }))
})
const distMax = computed(() => distRows.value.reduce((m,r)=> Math.max(m,r.count), 1))
</script>

<template>
  <div class="container">
    <!-- Toolbar -->
    <div class="toolbar">
      <div>
        <h2>Panel de Métricas</h2>
        <p class="subtitle">Vista demo sin datos reales de Spotify.</p>
      </div>
      <div class="toolbar-actions">
        <button class="range-btn" @click="setRange(28)">Últimas ~4 semanas</button>
        <button class="range-btn" @click="setRange(180)">~6 meses</button>
        <button class="range-btn" @click="setHistorical()">Histórico</button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="card" style="margin-bottom:16px">
      <div class="kpi-grid">
        <div class="kpi">
          <div class="title">Eventos de escucha</div>
          <div class="value">{{ store.kpiEventos }}</div>
          <div class="chip">Mock</div>
        </div>
        <div class="kpi">
          <div class="title">Canciones únicas</div>
          <div class="value">{{ store.kpiCancionesUnicas }}</div>
        </div>
        <div class="kpi">
          <div class="title">Horas totales</div>
          <div class="value">{{ store.kpiHoras }} h</div>
        </div>
        <div class="kpi">
          <div class="title">Artistas únicos</div>
          <div class="value">{{ store.kpiArtistasUnicos }}</div>
        </div>
      </div>
    </div>

    <!-- Paneles -->
    <div class="grid-2">
      <!-- Tendencia -->
      <div class="card">
        <div class="panel-header">
          <h3>Tendencia de Reproducciones</h3>
          <span class="chip">Demo</span>
        </div>

        <!-- Agregación SOLO del gráfico -->
        <div class="panel-subheader">
          <label class="agg">
            <span>Agregación:</span>
            <select v-model="agg">
              <option value="daily">Diaria</option>
              <option value="monthly">Mensual</option>
            </select>
          </label>
        </div>

        <div class="chart-wrap">
          <ChartCard type="bar" :data="barData" :options="barOptions" />
        </div>

        <!-- Tabla diaria fija -->
        <div class="table-scroll" style="margin-top:10px">
          <table class="trend">
            <thead>
              <tr><th>Día</th><th class="num">Reproducciones</th></tr>
            </thead>
            <tbody>
              <tr v-for="([day,count]) in tendenciaLista" :key="day">
                <td>{{ day }}</td>
                <td class="num">{{ count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Distribución por canción -->
      <div class="card">
        <div class="panel-header">
          <h3>Distribución por Canción</h3>
          <span class="chip">Demo</span>
        </div>

        <ul class="legend">
          <li v-for="row in distRows" :key="row.trackId">
            <span class="dot"></span>
            <span class="name">{{ row.name }}</span>
            <div class="bar">
              <div class="fill" :style="{ width: ((row.count / distMax) * 100) + '%' }"></div>
            </div>
            <span class="count">{{ row.count }}</span>
          </li>
          <li v-if="!distRows.length" class="empty">Sin datos en el rango actual.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fondo parejo */
.container { background:#0b0f15; }

/* Toolbar */
.toolbar { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:14px }
.subtitle { opacity:.8; margin:.25rem 0 0 }
.toolbar-actions { display:flex; gap:.6rem; align-items:center }
.range-btn {
  background:#162030; border:1px solid #253040; border-radius:8px;
  color:#dce3ea; font-size:.8rem; padding:.35rem .7rem; cursor:pointer; transition:.2s;
}
.range-btn:hover{ background:#1f2c40 }

/* KPIs */
.kpi-grid{ display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:12px }
.kpi{ background:#0f141b; border:1px solid #202632; border-radius:12px; padding:12px; position:relative }
.kpi .title{ opacity:.85; font-size:.9rem; margin-bottom:.25rem }
.kpi .value{ font-weight:800; font-size:1.5rem }
.kpi .chip{ position:absolute; right:10px; bottom:10px; background:#15202b; border:1px solid #254050; color:#cfeadb; border-radius:999px; padding:.15rem .5rem; font-size:.72rem }

/* Grid paneles */
.grid-2{ display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
@media (max-width: 980px){ .grid-2{ grid-template-columns: 1fr } }

/* Tarjetas */
.card{ background:#0f141b; border:1px solid #202632; border-radius:12px; padding:12px }
.panel-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:6px }
.panel-subheader{ display:flex; justify-content:flex-end; margin-bottom:8px }
.agg{ display:flex; gap:.4rem; align-items:center }
.agg select{ background:#0b0f15; border:1px solid #2a3240; color:#cfd8e3; padding:.3rem .5rem; border-radius:8px }

/* Chart & Table */
.chart-wrap{ height:240px; border:1px solid var(--border); border-radius:12px; overflow:hidden }
.chart-wrap :deep(canvas){ width:100% !important; height:100% !important; display:block }
.table-scroll{ max-height:240px; overflow:auto; border:1px solid var(--border); border-radius:12px }
.trend{ width:100%; border-collapse:collapse; font-size:.95rem }
.trend thead th{
  position:sticky; top:0; background:#0c1526; color:#cdd6e3; padding:8px 12px; text-align:left; border-bottom:1px solid var(--border)
}
.trend td{ padding:8px 12px; border-bottom:1px solid #0f172a }
.trend tbody tr:nth-child(odd) td{ background:#0f172a }
.trend tbody tr:nth-child(even) td{ background:#0c1426 }
.trend .num{ text-align:right; width:140px }

/* Distribución */
.legend{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px }
.legend li{ display:grid; grid-template-columns: 12px 1fr 1.2fr 60px; align-items:center; gap:8px }
.legend .dot{ width:10px; height:10px; border-radius:50%; background:linear-gradient(180deg, var(--accent), var(--accent-2)) }
.legend .name{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
.legend .bar{ height:12px; background:#15202b; border:1px solid #244; border-radius:999px; overflow:hidden }
.legend .fill{ height:100%; background:linear-gradient(90deg, #26d36e, #3dfc7a) }
.legend .count{ text-align:right; opacity:.9 }
.legend .empty{ opacity:.7; grid-column: 1 / -1; padding:.4rem 0 }
</style>
