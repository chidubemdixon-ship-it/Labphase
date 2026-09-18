const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the URI defined in the
 * environment variables. Exits the process on failure so that the
 * app never runs in a half-connected state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 8+ no longer needs useNewUrlParser / useUnifiedTopology,
      // they're kept here as comments for reference on older versions:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect is handled by the driver.');
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
