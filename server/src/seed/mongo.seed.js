require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const Song = require('../models/song');
const Album = require('../models/album');
const Artist = require('../models/artist');
const Play = require('../models/play');
const memory = require('./memory.seed');

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri);

  await Promise.all([User.deleteMany(), Song.deleteMany(), Album.deleteMany(), Artist.deleteMany(), Play.deleteMany()]);

  await Artist.insertMany(memory.artists);
  await Album.insertMany(memory.albums);
  await Song.insertMany(memory.songs);
  await User.insertMany(memory.users);
  await Play.insertMany(memory.plays);

  console.log('Seeded MongoDB with sample data');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
