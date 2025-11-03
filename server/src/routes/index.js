const express = require('express');
const users = require('./users');
const songs = require('./songs');
const albums = require('./albums');
const artists = require('./artists');
const stats = require('./stats');

const router = express.Router();
router.use('/users', users);
router.use('/songs', songs);
router.use('/albums', albums);
router.use('/artists', artists);
router.use('/stats', stats);

module.exports = router;
