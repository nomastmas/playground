// fake encoder service
const express = require('express');
const short = require('short-uuid');

const app = express();
app.use(express.json());
const PORT = 3001;

app.post('/job', async (req, res) => {
    const jobId = short.generate();
    res.status(201).json({ id: jobId });
});

app.get('/job/:id', async (req, res) => {
    console.log(`Checking status for job ${req.params.id}...`);

    const isCompleted = Math.random() < 0.3; // 30% chance complete
    const status = isCompleted ? 'completed' : 'pending';

    res.status(200).json({
        id: req.params.id,
        status
    });
});

app.listen(PORT, () => {
    console.log(`Encoder service running on port ${PORT}`);
});
