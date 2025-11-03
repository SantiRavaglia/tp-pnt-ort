<script setup>
import { computed } from 'vue'
import { useUserMetricsStore } from '../stores/userMetrics'
import KpiStat from '../components/KpiStat.vue'
import DateRangeSelector from '../components/DateRangeSelector.vue'

const store = useUserMetricsStore()
const tendenciaLista = computed(() => {
  const entries = Object.entries(store.tendenciaPorDia)
  entries.sort((a,b)=>a[0].localeCompare(b[0]))
  return entries
})
</script>

<template>
  <div class="container">
    <!-- Toolbar -->
    <div class="toolbar">
      <div>
        <h2>Panel de Métricas</h2>
        <p class="subtitle">Vista demo sin datos reales de Spotify.</p>
      </div>
      <DateRangeSelector />
    </div>

    <!-- Bloque KPI (card grande con 4 KPIs) -->
    <div class="card" style="margin-bottom:16px">
      <div class="kpi-grid">
        <div class="kpi">
          <div class="title">Eventos de escucha</div>
          <div class="value">{{ store.kpiEventos }}</div>
          <div class="chip" style="margin-top:6px">Mock</div>
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

    <!-- Dos paneles lado a lado -->
    <div class="grid-2">
      <!-- Tendencia -->
      <div class="card">
        <div class="panel-header">
          <h3>Tendencia de Reproducciones</h3>
          <span class="chip">Demo</span>
        </div>

        <!-- placeholder de gráfico; luego metemos Chart.js -->
        <div class="chart-placeholder">[Gráfico de barras aquí]</div>

        <!-- tabla compacta debajo del gráfico -->
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

      <!-- Distribución por canción (mock) -->
      <div class="card">
        <div class="panel-header">
          <h3>Distribución por Canción</h3>
          <span class="chip">Demo</span>
        </div>

        <!-- barra apilada fake (solo estética) -->
        <div class="stackbar">
          <div class="seg" style="flex:5"></div>
          <div class="seg" style="flex:3"></div>
          <div class="seg" style="flex:2"></div>
          <div class="seg" style="flex:1"></div>
          <div class="seg" style="flex:1"></div>
        </div>

        <ul class="legend">
          <li><span class="dot"></span> Song A — 950</li>
          <li><span class="dot"></span> Song B — 730</li>
          <li><span class="dot"></span> Song C — 620</li>
          <li><span class="dot"></span> Song D — 540</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-2{ display:grid; grid-template-columns: 1fr 1fr; gap:16px }
@media (max-width: 980px){ .grid-2{ grid-template-columns: 1fr } }

.panel-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:10px }
.chart-placeholder{
  height:220px; border:1px dashed var(--border); border-radius:12px;
  display:grid; place-items:center; color:#94a3b8; background:#0e1629;
}

.table-scroll{ max-height:240px; overflow:auto; border:1px solid var(--border); border-radius:12px }
.trend{ width:100%; border-collapse:collapse; font-size:.95rem }
.trend thead th{
  position:sticky; top:0; background:#0c1526; color:#cdd6e3; padding:8px 12px; text-align:left; border-bottom:1px solid var(--border)
}
.trend td{ padding:8px 12px; border-bottom:1px solid #0f172a }
.trend tbody tr:nth-child(odd) td{ background:#0f172a }
.trend tbody tr:nth-child(even) td{ background:#0c1426 }
.trend .num{ text-align:right; width:140px }

/* barra apilada fake */
.stackbar{ display:flex; gap:6px; height:20px; margin:8px 0 10px }
.stackbar .seg{ background:linear-gradient(180deg, var(--accent), var(--accent-2)); border-radius:4px; box-shadow: inset 0 0 10px #00000033}

.legend{ display:grid; gap:6px; padding-left:0; list-style:none; margin-top:8px }
.legend .dot{
  display:inline-block; width:10px; height:10px; border-radius:50%;
  background:linear-gradient(180deg, var(--accent), var(--accent-2)); margin-right:8px
}
</style>
