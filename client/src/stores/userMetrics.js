import { defineStore } from 'pinia'
import dayjs from 'dayjs'

// 👇 helper para generar plays "realistas"
function makeMock(daysBack = 28, total = 50) {
  const tracks = [
    { id:'t1', name:'Song A', duration_ms:200000, artists:[{id:'a1', name:'Artist 1'}]},
    { id:'t2', name:'Song B', duration_ms:180000, artists:[{id:'a2', name:'Artist 2'}]},
    { id:'t3', name:'Song C', duration_ms:240000, artists:[{id:'a3', name:'Artist 3'}]},
    { id:'t4', name:'Song D', duration_ms:210000, artists:[{id:'a2', name:'Artist 2'}]},
    { id:'t5', name:'Song E', duration_ms:230000, artists:[{id:'a1', name:'Artist 1'}]},
  ]
  const out = []
  for (let i = 0; i < total; i++) {
    const t = tracks[Math.floor(Math.random() * tracks.length)]
    const daysAgo = Math.floor(Math.random() * daysBack)
    const d = dayjs().subtract(daysAgo, 'day')
      .hour(Math.floor(Math.random()*24))
      .minute(Math.floor(Math.random()*60))
      .second(Math.floor(Math.random()*60))
    out.push({ played_at: d.toISOString(), track: t })
  }
  return out
}

export const useUserMetricsStore = defineStore('userMetrics', {
  state: () => ({
    timeRange: 'short_term',
    recently: makeMock(28, 50), // default
  }),
  getters: {
    kpiEventos: (s) => s.recently.length,
    kpiCancionesUnicas: (s) => new Set(s.recently.map(i=>i.track.id)).size,
    kpiArtistasUnicos: (s) => new Set(s.recently.flatMap(i=>i.track.artists.map(a=>a.id))).size,
    kpiHoras: (s) => (s.recently.reduce((acc,i)=>acc + i.track.duration_ms,0) / 3600000).toFixed(2),
    tendenciaPorDia: (s) => {
      const m = {}
      for (const i of s.recently) {
        const d = dayjs(i.played_at).format('YYYY-MM-DD')
        m[d] = (m[d] ?? 0) + 1
      }
      return m
    }
  },
  actions: {
    setRange(r){
      this.timeRange = r
      // 👇 simulamos distintos “horizontes”
      if (r === 'short_term') {
        this.recently = makeMock(28, 50)       // ~4 semanas
      } else if (r === 'medium_term') {
        this.recently = makeMock(180, 120)     // ~6 meses
      } else {
        this.recently = makeMock(720, 200)     // histórico
      }
    },
  }
})
