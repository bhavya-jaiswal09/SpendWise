// Custom DNS is helpful for local development (e.g. ISP SRV resolution issues with MongoDB Atlas)
// but should NOT override cloud host resolvers on platforms like Render where it can cause connection timeouts.
if (!process.env.RENDER && process.env.NODE_ENV !== 'production') {
  try {
    const dns = require("dns");
    dns.setServers(["8.8.8.8"]);
  } catch (err) {
    console.warn("Could not set custom DNS servers:", err.message);
  }
}

require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Ensure the database is connected before accepting requests.
  await connectDB();

  app.listen(PORT, () => {
    console.log(`SpendWise API server running on port ${PORT}`);
  });
};

startServer();
