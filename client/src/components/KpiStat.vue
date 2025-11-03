<script setup>
defineProps({
  title: String,
  value: [String, Number],
  hint: String
})
</script>

<template>
  <div class="kpi">
    <div class="kpi-title">{{ title }}</div>
    <div class="kpi-value">{{ value }}</div>
    <div v-if="hint" class="kpi-hint">{{ hint }}</div>
  </div>
</template>

<style scoped>
.kpi{padding:12px;border-radius:12px;background:#0f172a;color:#e2e8f0}
.kpi-title{font-size:.9rem;opacity:.8}
.kpi-value{font-size:1.6rem;font-weight:700;margin-top:4px}
.kpi-hint{font-size:.8rem;opacity:.6;margin-top:4px}
</style>
