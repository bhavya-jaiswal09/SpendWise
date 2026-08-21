const dns = require("dns");

dns.setServers(["8.8.8.8"]);

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
