require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;

async function start() {
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI missing in .env');
  process.exit(1);
}
try {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
} catch (err) {
  console.error('MongoDB connection error', err);
  process.exit(1);
}

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start();
