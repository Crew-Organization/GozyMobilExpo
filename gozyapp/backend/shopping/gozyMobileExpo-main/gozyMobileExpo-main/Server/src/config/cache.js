const Redis = require('ioredis');

const { env } = require('./env');

const memoryCache = new Map();
let redisClient;

function getRedisClient() {
  if (redisClient !== undefined) {
    return redisClient;
  }

  if (!env.redisUrl) {
    redisClient = null;
    return redisClient;
  }

  try {
    redisClient = new Redis(env.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });

    redisClient.on('error', () => {
      // Fall back to in-memory caching if Redis is unavailable in local mode.
    });
  } catch {
    redisClient = null;
  }

  return redisClient;
}

async function getCachedValue(key) {
  const client = getRedisClient();
  if (client) {
    try {
      await client.connect();
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return memoryCache.get(key) ?? null;
    }
  }

  return memoryCache.get(key) ?? null;
}

async function setCachedValue(key, value, ttlSeconds = 300) {
  const client = getRedisClient();
  if (client) {
    try {
      await client.connect();
      await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return;
    } catch {
      memoryCache.set(key, value);
      return;
    }
  }

  memoryCache.set(key, value);
  const timer = setTimeout(() => {
    memoryCache.delete(key);
  }, ttlSeconds * 1000);
  if (typeof timer.unref === 'function') {
    timer.unref();
  }
}

module.exports = {
  getCachedValue,
  setCachedValue,
};
