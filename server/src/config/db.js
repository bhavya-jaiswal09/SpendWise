const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI provided in environment variables.
 * The server should call this and wait for it to resolve before
 * accepting any requests.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Avoid leaking the connection string or internal details.
    console.error('MongoDB connection failed. Please check your MONGODB_URI.');
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
