// client/src/stores/userMetrics.js
import { defineStore } from 'pinia'

// ---------------------------------------------
// Utilidades
// ---------------------------------------------
function toISODate(d) {
  if (typeof d === 'string') return d.slice(0, 10)
  const z = new Date(d)
  return z.toISOString().slice(0, 10)
}
function inRangeISO(iso, startISO, endISO) {
  if (startISO && iso < startISO) return false
  if (endISO && iso > endISO) return false
  return true
}
function daysBackISO(n) {
  const d = new Date()
  d.setHours(0,0,0,0)
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0,10)
}

// ---------------------------------------------
// Store
// ---------------------------------------------
export const useUserMetricsStore = defineStore('userMetrics', {
  state: () => ({
    // demo data
    tracks: [],    // [{id,title,artistId,duration}]
    artists: [],   // [{id,name}]
    listens: [],   // [{id,user_id,trackId,ts}]

    // control
    _loaded: false,

    // rango de fechas (ISO 'YYYY-MM-DD'); si es null -> últimos 30 días
    range: {
      start: null,
      end:   null,
    },
  }),

  getters: {
    // map rápido por id
    mapTrackById: (s) => Object.fromEntries((s.tracks || []).map(t => [t.id, t])),
    mapArtistById: (s) => Object.fromEntries((s.artists || []).map(a => [a.id, a])),

    // rango normalizado (si no setearon, tomamos 30 días hacia atrás)
    startISO: (s) => s.range.start || daysBackISO(29),
    endISO:   (s) => s.range.end   || toISODate(new Date()),

    // listens filtrados por rango
    filteredListens(s) {
      const start = this.startISO
      const end   = this.endISO
      return (s.listens || []).filter(l => inRangeISO(l.ts.slice(0,10), start, end))
    },

    // ---------------- KPIs ----------------
    kpiEventos() {
      return this.filteredListens.length
    },
    kpiCancionesUnicas() {
      const set = new Set(this.filteredListens.map(l => l.trackId))
      return set.size
    },
    kpiArtistasUnicos() {
      const ids = new Set(this.filteredListens.map(l => this.mapTrackById[l.trackId]?.artistId).filter(Boolean))
      return ids.size
    },
    kpiHoras() {
      // suma duración por evento (aprox); si quisieras únicos, cambia a Set de tracks
      const totalSecs = this.filteredListens.reduce((acc, l) => {
        const d = this.mapTrackById[l.trackId]?.duration || 0
        return acc + d
      }, 0)
      // 1 decimal (p.e. 3.1)
      return Math.round((totalSecs / 3600) * 10) / 10
    },

    // -------------- Tendencia por día --------------
    // Devuelvo { 'YYYY-MM-DD': count, ... } sobre el rango
    tendenciaPorDia() {
      const buckets = {}
      // inicializo todos los días del rango (para que el gráfico no tenga huecos)
      const start = new Date(this.startISO)
      const end   = new Date(this.endISO)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0,10)
        buckets[key] = 0
      }
      // cuento
      this.filteredListens.forEach(l => {
        const day = l.ts.slice(0,10)
        if (buckets[day] != null) buckets[day]++
      })
      return buckets
    },

    // -------------- Distribución por canción --------------
    // salida básica: [{ trackId, count }, ...] top N
    distribucionPorCancion() {
      const freq = {}
      this.filteredListens.forEach(l => {
        freq[l.trackId] = (freq[l.trackId] || 0) + 1
      })
      return Object.entries(freq)
        .map(([trackId, count]) => ({ trackId: Number(trackId), count }))
        .sort((a,b) => b.count - a.count)
        .slice(0, 6)
    },

    // salida con nombres ya resueltos (útil si la vista quiere directamente el nombre)
    topCanciones() {
      return this.distribucionPorCancion.map(r => {
        const t = this.mapTrackById[r.trackId]
        return { id: r.trackId, title: t?.title || `#${r.trackId}`, count: r.count }
      })
    },
  },

  actions: {
    // para que el Dashboard tenga data sin backend
    async ensureDemoLoaded() {
      if (this._loaded) return
      this.seedDemo()
      this._loaded = true
    },

    setRange({ start, end }) {
      // acepta Date o string ISO 'YYYY-MM-DD'
      this.range.start = start ? toISODate(start) : null
      this.range.end   = end   ? toISODate(end)   : null
    },
    clearRange(){ this.range.start = this.range.end = null },

    // ---------------- Demo data ----------------
    seedDemo() {
      this.artists = [
        { id: 5001, name: 'Gustavo Cerati' },
        { id: 5002, name: 'Soda Stereo' },
        { id: 5003, name: 'Babasónicos' }
      ]
      this.tracks = [
        { id: 1001, title: 'Crimen',     artistId: 5001, duration: 220 },
        { id: 1002, title: 'Adiós',      artistId: 5001, duration: 215 },
        { id: 1003, title: 'De Música Ligera', artistId: 5002, duration: 190 },
        { id: 1004, title: 'Carismático', artistId: 5003, duration: 210 },
        { id: 1005, title: 'Yegua',       artistId: 5003, duration: 260 }
      ]
      // listens en las últimas ~5 semanas (mismo estilo que veníamos usando)
      const L = []
      let id = 1
      const push = (user_id, trackId, iso) => L.push({ id: id++, user_id, trackId, ts: iso })

      const sample = [
        ['2025-10-14T12:01:00Z', 1001], ['2025-10-15T10:11:00Z', 1001],
        ['2025-10-15T23:40:00Z', 1003], ['2025-10-17T18:00:00Z', 1004],
        ['2025-10-19T13:00:00Z', 1002], ['2025-10-20T20:00:00Z', 1002],
        ['2025-10-22T07:45:00Z', 1005], ['2025-10-23T08:20:00Z', 1005],
        ['2025-10-24T15:00:00Z', 1001], ['2025-10-25T15:30:00Z', 1003],
        ['2025-10-27T12:00:00Z', 1001], ['2025-10-29T11:00:00Z', 1002],
        ['2025-10-31T21:00:00Z', 1004], ['2025-11-01T09:00:00Z', 1004],
        ['2025-11-01T20:12:00Z', 1004], ['2025-11-02T08:30:00Z', 1001],
        ['2025-11-03T18:00:00Z', 1005], ['2025-11-04T10:00:00Z', 1005],
        ['2025-11-05T10:02:00Z', 1005], ['2025-11-05T10:05:00Z', 1002],
        ['2025-11-05T10:35:00Z', 1002], ['2025-11-06T21:00:00Z', 1001],
        ['2025-11-06T21:20:00Z', 1003], ['2025-11-07T12:00:00Z', 1003],
        ['2025-11-07T12:40:00Z', 1003], ['2025-11-08T13:00:00Z', 1005],
        ['2025-11-08T13:15:00Z', 1005], ['2025-11-09T11:00:00Z', 1002],
        ['2025-11-10T09:30:00Z', 1001], ['2025-11-10T21:00:00Z', 1004],
        ['2025-11-11T10:00:00Z', 1002], ['2025-11-11T20:10:00Z', 1002],
        ['2025-11-12T07:10:00Z', 1002], ['2025-11-12T15:45:00Z', 1003],
        ['2025-11-13T17:40:00Z', 1001], ['2025-11-13T21:10:00Z', 1001],
        ['2025-11-14T08:00:00Z', 1001], ['2025-11-14T12:00:00Z', 1004],
        ['2025-11-14T18:00:00Z', 1005], ['2025-11-15T14:00:00Z', 1005],
        ['2025-11-15T19:20:00Z', 1005], ['2025-11-16T10:10:00Z', 1005],
        ['2025-11-16T22:40:00Z', 1003], ['2025-11-17T11:12:00Z', 1001],
        ['2025-11-17T19:00:00Z', 1002], ['2025-11-18T11:45:00Z', 1004],
        ['2025-11-18T17:25:00Z', 1004], ['2025-11-19T08:20:00Z', 1003],
        ['2025-11-19T23:50:00Z', 1002], ['2025-11-20T09:10:00Z', 1001],
      ]
      for (const [iso, trackId] of sample) push(3, trackId, iso)

      this.listens = L
    },
  },
})
