const mongoose = require("mongoose");

const connectDB = async () => {
  const options = {
    // Basic connection options
    autoIndex: true, // Build indexes automatically
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
  };

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  const MAX_RETRIES = 5;
  let retryCount = 0;

  const establishConnection = async () => {
    try {
      console.log(`Attempting to connect to MongoDB Atlas (Attempt ${retryCount + 1})...`);
      
      const conn = await mongoose.connect(MONGO_URI, options);
      
      console.log(`\n--- [DATABASE CONNECTED] ---`);
      console.log(`Host: ${conn.connection.host}`);
      console.log(`Database: ${conn.connection.name}`);
      console.log(`-----------------------------\n`);

      // Event listeners for monitoring
      mongoose.connection.on('error', (err) => {
        console.error(`MongoDB connection error: ${err}`);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected successfully.');
      });

      // Handle query performance logging in development
      if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', (collectionName, method, query, doc) => {
          const start = Date.now();
          // We can't easily hook into the end of the query here, 
          // but we can log that a query is happening.
          console.log(`[DB QUERY] ${collectionName}.${method} - ${JSON.stringify(query)}`);
        });
      }

    } catch (error) {
      retryCount++;
      console.error(`MongoDB connection failed: ${error.message}`);
      
      if (retryCount < MAX_RETRIES) {
        const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Retrying in ${backoffTime / 1000} seconds...`);
        setTimeout(establishConnection, backoffTime);
      } else {
        console.error("Max connection retries reached. Exiting process.");
        process.exit(1);
      }
    }
  };

  await establishConnection();
};

// Disconnection handler for graceful shutdown
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination.");
  } catch (err) {
    console.error(`Error during MongoDB disconnection: ${err}`);
  }
};

module.exports = { connectDB, closeDB };
