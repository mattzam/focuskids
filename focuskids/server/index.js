require('dotenv').config();
const express = require('express');
const cors = require('cors');
const profilesRouter = require('./routes/profiles');
const tasksRouter = require('./routes/tasks');
const rewardsRouter = require('./routes/rewards');
const sessionsRouter = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'FocusKids API', version: '1.0.0' });
});

// Routes
app.use('/api/profiles', profilesRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/sessions', sessionsRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 FocusKids API running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health\n`);
});
