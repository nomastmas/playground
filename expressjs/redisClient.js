const Redis = require('ioredis');

const redisHost = process.env.REDIS_HOST || '127.0.0.1';

const redis = new Redis({
  host: redisHost,
  port: 6379,
});

module.exports = redis;
