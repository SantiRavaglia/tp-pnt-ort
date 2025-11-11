<script setup>
import { useUserMetricsStore } from '../stores/userMetrics'
const store = useUserMetricsStore()

function applyRange(start, end){
  metrics.setRange({ start, end }) 
}

const options = [
  { key:'short_term',  label:'Últimas ~4 semanas' },
  { key:'medium_term', label:'~6 meses' },
  { key:'long_term',   label:'Histórico' },
]
</script>

<template>
  <div class="range">
    <button
      v-for="o in options" :key="o.key"
      :class="['btn', {active: store.timeRange===o.key}]"
      @click="store.setRange(o.key)"
    >{{ o.label }}</button>
  </div>
</template>

<style scoped>
.range{display:flex;gap:8px;flex-wrap:wrap}
.btn{padding:6px 10px;border-radius:10px;border:1px solid #334155;background:#0b1220;color:#e2e8f0;cursor:pointer}
.btn.active{border-color:#22c55e}
</style>
