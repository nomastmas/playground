

jest.mock('ioredis');
let redis;
let redisClient;

describe('Redis Client', () => {
  describe('Redis with env set', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.clearAllMocks();
      process.env.REDIS_HOST = 'custom-redis-host';
      redis = require('ioredis');
      require('./redisClient');
    });

    afterEach(() => {
        delete process.env.REDIS_HOST;
    })
    it('should set host as REDIS_HOST env variable', () => {
        expect(redis).toHaveBeenCalledWith({ host: 'custom-redis-host', port: 6379 });
    });
  });
  describe('Redis without env set', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.clearAllMocks();
      delete process.env.REDIS_HOST;
      redis = require('ioredis');
      require('./redisClient');
    });
    it('should set host as 127.0.0.1 as fallback env variable', () => {
        expect(redis).toHaveBeenCalledWith({ host: '127.0.0.1', port: 6379 });
    });
  });
})