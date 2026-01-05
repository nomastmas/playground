jest.mock('axios');
jest.mock('short-uuid', () => {
  return {generate: jest.fn()}
});
jest.mock('./redisClient', () => {
  return {
    hset: jest.fn(),
    sadd: jest.fn(),
    keys: jest.fn(),
    hgetall: jest.fn()
  }
});

const axios = require('axios');
const short = require('short-uuid');
const redis = require('./redisClient');
let app;
const supertest = require('supertest');

describe('Server test', () => {
  describe('post /job', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      process.env.ENCODER_URL = 'http://fake-encoder-url';
      app = require('./server.js');

    });

    afterEach(() => {
      delete process.env.ENCODER_URL;
    });
    it('should create a new job', async () => {
      const mockJobId = 123;
      const mockEncoderId = 123123;
      short.generate.mockReturnValue(mockJobId);
      axios.post.mockResolvedValue({"data": { "id": mockEncoderId}})
      const mockJobData = {
        id: mockJobId,
        encoderJobId: mockEncoderId,
        status: 'pending',
        createdAt: expect.any(String)
      }

      const response = await supertest(app)
        .post('/job')
        .send({});
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('jobId', mockJobId);
      expect(response.body).toHaveProperty('message', 'Job created');
      expect(axios.post).toHaveBeenCalledWith(`${process.env.ENCODER_URL}:3001/job`);
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(redis.hset).toHaveBeenCalledWith(`job:${mockJobId}`, mockJobData);
      expect(redis.hset).toHaveBeenCalledTimes(1);
      expect(redis.sadd).toHaveBeenCalledWith('jobs:pending', mockJobId);
      expect(redis.sadd).toHaveBeenCalledTimes(1);
    });
  });

  describe('get /job', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      app = require('./server.js');

    });
    it('should get all jobs', async () => {
      const mockKeys = ['job:1', 'job:2']
      const mockJob1 = {id: '1', status: 'pending'}
      const mockJob2 = {id: '2', status: 'completed'}
      const mockJobs = [mockJob1, mockJob2];
      redis.keys.mockResolvedValue(mockKeys);
      redis.hgetall.mockResolvedValueOnce(mockJob1).mockResolvedValueOnce(mockJob2);

      const response = await supertest(app).get('/job').send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockJobs);
      expect(redis.keys).toHaveBeenCalledTimes(1);
      expect(redis.hgetall).toHaveBeenCalledTimes(mockJobs.length);
      expect(redis.keys).toHaveBeenCalledWith('job:*');

    })
  })
})