const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);

// 404 handler (must come after all valid routes)
app.use(notFound);

// Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
