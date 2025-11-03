const users = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com' },
  { id: 'u2', name: 'Bob', email: 'bob@example.com' }
];

const artists = [
  { id: 'a1', name: 'Daft Punk' },
  { id: 'a2', name: 'Radiohead' }
];

const albums = [
  { id: 'al1', title: 'In Rainbows', artistId: 'a2', year: 2007 },
  { id: 'al2', title: 'Random Access Memories', artistId: 'a1', year: 2013 }
];

const songs = [
  { id: 's1', title: 'Beyond', durationSeconds: 210, albumId: 'al2', artistId: 'a1' },
  { id: 's2', title: 'All I Need', durationSeconds: 180, albumId: 'al1', artistId: 'a2' },
  { id: 's3', title: 'Nude', durationSeconds: 160, albumId: 'al1', artistId: 'a2' }
];

const plays = [
  { id: 'p1', userId: 'u1', songId: 's1', durationSeconds: 210, playedAt: '2025-10-30T09:00:00Z' },
  { id: 'p2', userId: 'u1', songId: 's2', durationSeconds: 90, playedAt: '2025-10-30T10:00:00Z' },
  { id: 'p3', userId: 'u1', songId: 's3', durationSeconds: 160, playedAt: '2025-10-31T11:00:00Z' },
  { id: 'p4', userId: 'u2', songId: 's1', durationSeconds: 210, playedAt: '2025-10-31T12:00:00Z' }
];

module.exports = { users, artists, albums, songs, plays };
