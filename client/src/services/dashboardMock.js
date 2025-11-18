const artists = [
  { id: 5001, name: 'Gustavo Cerati' },
  { id: 5002, name: 'Soda Stereo' },
  { id: 5003, name: 'Babasónicos' }
];
const tracks = [
  { id: 1001, title: 'Song A', artistId: 5001, duration: 210 },
  { id: 1002, title: 'Song B', artistId: 5001, duration: 240 },
  { id: 1003, title: 'Song C', artistId: 5002, duration: 200 },
  { id: 1004, title: 'Song D', artistId: 5003, duration: 230 },
  { id: 1005, title: 'Song E', artistId: 5003, duration: 260 }
];


const listens = [
  { id: 1,  user_id: 3, trackId: 1001, ts: '2025-10-14T12:01:00Z' },
  { id: 2,  user_id: 3, trackId: 1001, ts: '2025-10-15T10:11:00Z' },
  { id: 3,  user_id: 3, trackId: 1003, ts: '2025-10-15T23:40:00Z' },
  { id: 4,  user_id: 3, trackId: 1004, ts: '2025-10-17T18:00:00Z' },
  { id: 5,  user_id: 3, trackId: 1002, ts: '2025-10-19T13:00:00Z' },
  { id: 6,  user_id: 3, trackId: 1002, ts: '2025-10-20T20:00:00Z' },
  { id: 7,  user_id: 3, trackId: 1005, ts: '2025-10-22T07:45:00Z' },
  { id: 8,  user_id: 3, trackId: 1005, ts: '2025-10-23T08:20:00Z' },
  { id: 9,  user_id: 3, trackId: 1001, ts: '2025-10-24T15:00:00Z' },
  { id: 10, user_id: 3, trackId: 1003, ts: '2025-10-25T15:30:00Z' },
  { id: 11, user_id: 3, trackId: 1001, ts: '2025-10-27T12:00:00Z' },
  { id: 12, user_id: 3, trackId: 1002, ts: '2025-10-29T11:00:00Z' },
  { id: 13, user_id: 3, trackId: 1004, ts: '2025-10-31T21:00:00Z' },
  { id: 14, user_id: 3, trackId: 1004, ts: '2025-11-01T09:00:00Z' },
  { id: 15, user_id: 3, trackId: 1004, ts: '2025-11-01T20:12:00Z' },
  { id: 16, user_id: 3, trackId: 1001, ts: '2025-11-02T08:30:00Z' },
  { id: 17, user_id: 3, trackId: 1005, ts: '2025-11-03T18:00:00Z' },
  { id: 18, user_id: 3, trackId: 1005, ts: '2025-11-04T10:00:00Z' },
  { id: 19, user_id: 3, trackId: 1005, ts: '2025-11-05T10:02:00Z' },
  { id: 20, user_id: 3, trackId: 1002, ts: '2025-11-05T10:05:00Z' },
  { id: 21, user_id: 3, trackId: 1002, ts: '2025-11-05T10:35:00Z' },
  { id: 22, user_id: 3, trackId: 1001, ts: '2025-11-06T21:00:00Z' },
  { id: 23, user_id: 3, trackId: 1003, ts: '2025-11-06T21:20:00Z' },
  { id: 24, user_id: 3, trackId: 1003, ts: '2025-11-07T12:00:00Z' },
  { id: 25, user_id: 3, trackId: 1003, ts: '2025-11-07T12:40:00Z' },
  { id: 26, user_id: 3, trackId: 1005, ts: '2025-11-08T13:00:00Z' },
  { id: 27, user_id: 3, trackId: 1005, ts: '2025-11-08T13:15:00Z' },
  { id: 28, user_id: 3, trackId: 1002, ts: '2025-11-09T11:00:00Z' },
  { id: 29, user_id: 3, trackId: 1001, ts: '2025-11-10T09:30:00Z' },
  { id: 30, user_id: 3, trackId: 1004, ts: '2025-11-10T21:00:00Z' },
  { id: 31, user_id: 3, trackId: 1002, ts: '2025-11-11T10:00:00Z' },
  { id: 32, user_id: 3, trackId: 1002, ts: '2025-11-11T20:10:00Z' },
  { id: 33, user_id: 3, trackId: 1002, ts: '2025-11-12T07:10:00Z' },
  { id: 34, user_id: 3, trackId: 1003, ts: '2025-11-12T15:45:00Z' },
  { id: 35, user_id: 3, trackId: 1001, ts: '2025-11-13T17:40:00Z' },
  { id: 36, user_id: 3, trackId: 1001, ts: '2025-11-13T21:10:00Z' },
  { id: 37, user_id: 3, trackId: 1001, ts: '2025-11-14T08:00:00Z' },
  { id: 38, user_id: 3, trackId: 1004, ts: '2025-11-14T12:00:00Z' },
  { id: 39, user_id: 3, trackId: 1005, ts: '2025-11-14T18:00:00Z' },
  { id: 40, user_id: 3, trackId: 1005, ts: '2025-11-15T14:00:00Z' },
  { id: 41, user_id: 3, trackId: 1005, ts: '2025-11-15T19:20:00Z' },
  { id: 42, user_id: 3, trackId: 1005, ts: '2025-11-16T10:10:00Z' },
  { id: 43, user_id: 3, trackId: 1003, ts: '2025-11-16T22:40:00Z' },
  { id: 44, user_id: 3, trackId: 1001, ts: '2025-11-17T11:12:00Z' },
  { id: 45, user_id: 3, trackId: 1002, ts: '2025-11-17T19:00:00Z' },
  { id: 46, user_id: 3, trackId: 1004, ts: '2025-11-18T11:45:00Z' },
  { id: 47, user_id: 3, trackId: 1004, ts: '2025-11-18T17:25:00Z' },
  { id: 48, user_id: 3, trackId: 1003, ts: '2025-11-19T08:20:00Z' },
  { id: 49, user_id: 3, trackId: 1002, ts: '2025-11-19T23:50:00Z' },
  { id: 50, user_id: 3, trackId: 1001, ts: '2025-11-20T09:10:00Z' }
];

function wait(ms){ return new Promise(r => setTimeout(r, ms)); }
const byId = arr => Object.fromEntries(arr.map(x => [x.id, x]));

export async function fetchDashboardData(user_id = 3) {
  await wait(120);
  const myListens = listens.filter(l => l.user_id === user_id);
  return {
    listens: myListens,
    tracks,
    artists,
    map: {
      track: byId(tracks),
      artist: byId(artists)
    }
  };
}

export function computeKpis({ listens, map }) {
  const uniqueTracks = new Set(listens.map(l => l.trackId));
  const uniqueArtists = new Set(
    [...uniqueTracks].map(tid => map.track[tid]?.artistId).filter(Boolean)
  );
  const totalSecs = listens.reduce((sum, l) => sum + (map.track[l.trackId]?.duration || 0), 0);
  return {
    events: listens.length,
    uniqueTracks: uniqueTracks.size,
    uniqueArtists: uniqueArtists.size,
    totalHours: totalSecs / 3600
  };
}

export function trendByDay(listens, days = 30) {
  const ref = new Date();
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(ref); d.setDate(ref.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.push({ day: key, count: 0 });
  }
  listens.forEach(l => {
    const day = l.ts.slice(0, 10);
    const b = buckets.find(x => x.day === day);
    if (b) b.count++;
  });
  return buckets;
}

export function distributionByTrack(listens, map, topN = 6) {
  const freq = {};
  listens.forEach(l => { freq[l.trackId] = (freq[l.trackId] || 0) + 1; });
  const rows = Object.entries(freq)
    .map(([trackId, count]) => ({
      trackId: Number(trackId),
      name: map.track[trackId]?.title || `#${trackId}`,
      count
    }))
    .sort((a,b) => b.count - a.count)
    .slice(0, topN);
  const max = rows[0]?.count || 1;
  return { rows, max };
}
