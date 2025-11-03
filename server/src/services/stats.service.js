const daoFactory = require('../daos/daoFactory');

const userDao = require('../daos/user.dao.mongo.js');
const songDao = require('../daos/song.dao.mongo.js');
const albumDao = require('../daos/album.dao.mongo.js');
const artistDao = require('../daos/artist.dao.mongo.js');
const playDao = require('../daos/play.dao.mongo.js');

/**
 * Sum durations from play records for a user
 * returns { totalSeconds, totalMinutes, playsCount, breakdown: { songId: seconds, albumId: seconds, artistId: seconds } }
 */
async function userListenTime(userId) {
  const plays = await playDao.findByUser(userId); // array of plays with durationSeconds, songId
  const breakdown = { songs: {}, albums: {}, artists: {} };
  let totalSeconds = 0;

  for (const p of plays) {
    const dur = p.durationSeconds || 0;
    totalSeconds += dur;
    breakdown.songs[p.songId] = (breakdown.songs[p.songId] || 0) + dur;
  }

  // attach album & artist breakdown
  const songIds = [...new Set(Object.keys(breakdown.songs))];
  if (songIds.length) {
    const songs = await songDao.findByIds(songIds);
    for (const s of songs) {
      const sec = breakdown.songs[s.id || s._id] || 0;
      const albumId = s.albumId;
      const artistId = s.artistId;
      if (albumId) breakdown.albums[albumId] = (breakdown.albums[albumId] || 0) + sec;
      if (artistId) breakdown.artists[artistId] = (breakdown.artists[artistId] || 0) + sec;
    }
  }

  return {
    userId,
    totalSeconds,
    totalMinutes: +(totalSeconds / 60).toFixed(2),
    playsCount: plays.length,
    breakdown
  };
}

async function songListenTime(songId) {
  const plays = await playDao.findBySong(songId);
  const totalSeconds = plays.reduce((s, p) => s + (p.durationSeconds || 0), 0);
  return { songId, totalSeconds, totalMinutes: +(totalSeconds / 60).toFixed(2), playsCount: plays.length };
}

async function albumListenTime(albumId) {
  const albumSongs = await songDao.findByAlbum(albumId);
  const songIds = albumSongs.map(s => s.id || s._id);
  const plays = await playDao.findBySongs(songIds);
  const totalSeconds = plays.reduce((s, p) => s + (p.durationSeconds || 0), 0);
  return { albumId, totalSeconds, totalMinutes: +(totalSeconds / 60).toFixed(2), playsCount: plays.length };
}

async function artistListenTime(artistId) {
  const artistSongs = await songDao.findByArtist(artistId);
  const songIds = artistSongs.map(s => s.id || s._id);
  const plays = await playDao.findBySongs(songIds);
  const totalSeconds = plays.reduce((s, p) => s + (p.durationSeconds || 0), 0);
  return { artistId, totalSeconds, totalMinutes: +(totalSeconds / 60).toFixed(2), playsCount: plays.length };
}

/**
 * Example breakdown per day for a user: returns [{ date: '2025-10-28', seconds: 123 }]
 */
async function userListenTimeByDay(userId) {
  const plays = await playDao.findByUser(userId);
  const map = {};
  for (const p of plays) {
    const d = new Date(p.playedAt || p.timestamp || p.date);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    map[key] = (map[key] || 0) + (p.durationSeconds || 0);
  }
  const rows = Object.entries(map).map(([date, seconds]) => ({ date, seconds, minutes: +(seconds/60).toFixed(2) }));
  rows.sort((a,b) => a.date.localeCompare(b.date));
  return rows;
}

module.exports = {
  userListenTime,
  songListenTime,
  albumListenTime,
  artistListenTime,
  userListenTimeByDay
};
