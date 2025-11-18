// Catálogo base (simplificado)
const artists = [
  { id: 5001, name: 'Gustavo Cerati', genres: ['rock', 'latino'] },
  { id: 5002, name: 'Soda Stereo',    genres: ['rock', 'argentina'] },
  { id: 5003, name: 'Babasónicos',    genres: ['rock', 'alt'] }
]
const albums = [
  { id: 7001, name: 'Bocanada',                artistId: 5001, year: 1999, genres: ['rock'] },
  { id: 7002, name: 'Ahí Vamos',               artistId: 5001, year: 2006, genres: ['rock'] },
  { id: 7003, name: 'Comfort y Música Para…',  artistId: 5003, year: 2001, genres: ['alt','rock'] }
]
const tracks = [
  { id:1001, title:'Puente',               artistId:5001, album_id:7001, duration:271, popularity:86, year:1999, genres:['rock','argentina'] },
  { id:1002, title:'Crimen',               artistId:5001, album_id:7002, duration:244, popularity:90, year:2006, genres:['rock','argentina'] },
  { id:1003, title:'De música ligera',     artistId:5002, album_id:7001, duration:190, popularity:95, year:1990, genres:['rock','argentina'] },
  { id:1004, title:'El Loco',              artistId:5003, album_id:7003, duration:220, popularity:70, year:2001, genres:['alt','rock'] }
]

// Favoritos (eventos) y búsquedas (eventos)
const favorites = [
  { id:1, user_id:3, entityType:'track',  entityId:1001, ts:'2025-11-05T10:10:00Z' },
  { id:2, user_id:3, entityType:'track',  entityId:1002, ts:'2025-11-06T12:22:00Z' },
  { id:3, user_id:3, entityType:'artist', entityId:5001, ts:'2025-11-06T12:25:00Z' },
  { id:4, user_id:3, entityType:'track',  entityId:1003, ts:'2025-11-07T18:40:00Z' },
  { id:5, user_id:3, entityType:'album',  entityId:7003, ts:'2025-11-09T09:05:00Z' },
  { id:6, user_id:3, entityType:'track',  entityId:1004, ts:'2025-11-10T14:20:00Z' }
]

const searches = [
  // query libre y timestamp; así podemos graficar búsquedas/día
  { id:1, user_id:3, q:'cerati',      ts:'2025-11-05T10:05:00Z' },
  { id:2, user_id:3, q:'bocanada',    ts:'2025-11-06T11:00:00Z' },
  { id:3, user_id:3, q:'soda',        ts:'2025-11-07T18:00:00Z' },
  { id:4, user_id:3, q:'babasónicos', ts:'2025-11-09T09:00:00Z' },
  { id:5, user_id:3, q:'rock',        ts:'2025-11-10T14:00:00Z' }
]

function wait(ms){ return new Promise(r=>setTimeout(r,ms)) }
function mapById(list){ return Object.fromEntries(list.map(x => [x.id, x])) }

export async function fetchCatalog(){
  await wait(150)
  return {
    tracks, albums, artists,
    byId: {
      track:  mapById(tracks),
      album:  mapById(albums),
      artist: mapById(artists)
    }
  }
}

export async function fetchFavoritesForUser(user_id=3){
  await wait(150)
  return favorites.filter(f => f.user_id === user_id)
}

export async function fetchSearchesForUser(user_id=3){
  await wait(120)
  return searches.filter(s => s.user_id === user_id)
}

export function computeKPIs({ favs }){
  const countsByType = favs.reduce((acc, f) => {
    acc[f.entityType] = (acc[f.entityType] || 0) + 1
    return acc
  }, { track:0, album:0, artist:0 })
  const total = favs.length
  const lastTs = favs.slice().sort((a,b)=> new Date(b.ts)-new Date(a.ts))[0]?.ts || null
  return { total, countsByType, lastTs }
}

export function topGenres({ favs, trackMap }, topN=6){
  const freq = {}
  favs.filter(f=>f.entityType==='track').forEach(f => {
    const t = trackMap[f.entityId]
    if (!t) return
    (t.genres||[]).forEach(g => freq[g] = (freq[g]||0)+1)
  })
  return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0, topN)
}

// Series por día (últimos N días) para cualquier array con campo ts
export function timeSeriesByDay(items, days=14){
  const ref = new Date()
  const buckets = []
  for (let i=days-1;i>=0;i--){
    const d = new Date(ref); d.setDate(ref.getDate() - i)
    const key = d.toISOString().slice(0,10)
    buckets.push({ day:key, count:0 })
  }
  items.forEach(it => {
    const day = it.ts.slice(0,10)
    const b = buckets.find(x => x.day === day)
    if (b) b.count++
  })
  return buckets
}
