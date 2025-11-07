require('dotenv').config();
const express = require('express');
const connectDB = require('./src/database/connection');
const { PORT } = require('./src/config');
const analyticsRoutes = require('./src/routes/analytics');

const app = express();
const port = PORT || 3000;

// Connect to MongoDB
connectDB();

// Import the bot to start it
require('./src/bot/telegramBot');

app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'VeriZen AI Server is Running!',
    timestamp: new Date().toISOString(),
    ai_provider: process.env.AI_PROVIDER || 'gemini'
  });
});

// API status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'operational',
    service: 'VeriZen AI',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});
app.use('/admin', analyticsRoutes);

app.listen(port, () => {
  console.log(` VeriZen AI Server running on port ${port}`);
  console.log(` AI Provider: ${process.env.AI_PROVIDER || 'gemini'}`);
  console.log(` Health check: http://localhost:${port}/`);
});