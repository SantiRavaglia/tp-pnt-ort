<template>
  <div class="card">
    <header v-if="title" class="card-title">{{ title }}</header>
    <canvas ref="el"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  type:   { type: String, required: true },
  data:   { type: Object, required: true },
  options:{ type: Object, default: () => ({}) },
  title:  { type: String, default: '' }
})

const el = ref(null)
let chart

function render(){
  if (chart) chart.destroy()
  chart = new Chart(el.value, {
    type: props.type,
    data: props.data,
    options: { responsive:true, maintainAspectRatio:false, ...props.options }
  })
}

onMounted(render)
watch(() => props.data, render, { deep:true })
onBeforeUnmount(() => chart && chart.destroy())
</script>

<style scoped>
.card { background:#0f141b; border:1px solid #202632; border-radius:16px; padding:1rem; height:320px }
.card-title { margin-bottom:.6rem; font-weight:600; opacity:.9 }
</style>
