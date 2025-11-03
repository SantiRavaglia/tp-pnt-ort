const express = require('express');
const ctrl = require('../controllers/statsController');
const router = express.Router();

// per-user listened time
router.get('/users/:id/listen-time', ctrl.userListenTime);
// per-song
router.get('/songs/:id/listen-time', ctrl.songListenTime);
// per-album
router.get('/albums/:id/listen-time', ctrl.albumListenTime);
// per-artist
router.get('/artists/:id/listen-time', ctrl.artistListenTime);

// Also: aggregated endpoints
router.get('/users/:id/listen-time/by-day', ctrl.userListenTimeByDay);

module.exports = router;
