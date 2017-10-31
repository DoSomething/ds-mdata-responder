'use strict';

const redis = require('redis');
const logger = require('winston');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

module.exports = function getRedisClient(overrideUrl) {
  const client = redis.createClient(overrideUrl || redisUrl);

  client.on('error', (error) => {
    logger.error(`Redis connection error: ${error}`);
    throw error;
  });

  return client;
};
