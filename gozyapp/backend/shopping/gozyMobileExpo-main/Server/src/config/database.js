const mongoose = require('mongoose');

const { env } = require('./env');

async function connectDatabase() {
  if (!env.mongoUri) {
    console.log('MongoDB URI not provided. Running Gozy server with in-memory seeded data.');
    return;
  }

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 3000,
  });
  console.log('MongoDB connected for Gozy backend.');
}

module.exports = { connectDatabase };
