const axios = require('axios');
const express = require('express');
const short = require('short-uuid');
const redis = require('./redisClient');

const app = express();
app.use(express.json());
const PORT = 3000;

// POST /job
app.post('/job', async (req, res) => {
  const jobId = short.generate();
  
  // Simulate calling encoder service (stubbed)
  const encoderJob = await axios.post(`${process.env.ENCODER_URL}:3001/job`)
  
  const jobData = {
    id: jobId,
    encoderJobId: encoderJob.data.id,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  await redis.hset(`job:${jobId}`, jobData);
  await redis.sadd('jobs:pending', jobId);

  res.status(201).json({ message: 'Job created', jobId });
});

// GET /job
app.get('/job', async (req, res) => {
  const keys = await redis.keys('job:*');
  const jobs = [];

  for (const key of keys) {
    const job = await redis.hgetall(key);
    jobs.push(job);
  }

  res.json(jobs);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
