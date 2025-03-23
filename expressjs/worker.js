const axios = require('axios');
const redis = require('./redisClient');

async function pollJobs() {
  const pendingJobIds = await redis.smembers('jobs:pending');

  for (const jobId of pendingJobIds) {
    const job = await redis.hgetall(`job:${jobId}`);

    try {
      console.log(`Polling encoder for job ${jobId}...`);
      
      // simulate success/failure after random delay
      const isCompleted = Math.random() < 0.3; // 30% chance complete
      
      if (isCompleted) {
        await redis.hset(`job:${jobId}`, {
          status: 'completed',
          completedAt: new Date().toISOString(),
        });
        await redis.srem('jobs:pending', jobId);
        console.log(`Job ${jobId} marked as completed.`);
      } else {
        console.log(`Job ${jobId} still pending...`);
      }

    } catch (err) {
      console.error(`Error polling job ${jobId}:`, err.message);
    }
  }
}

setInterval(pollJobs, 10000);

console.log('Background worker running...');
