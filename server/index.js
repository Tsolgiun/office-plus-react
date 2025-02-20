const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// CORS Configuration
const CORS_ORIGINS = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['https://office-plus.netlify.app'];

// Middleware
app.use(cors({
  origin: CORS_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection with retries
const connectWithRetry = async (retries = 5, delay = 5000) => {
  console.log('Attempting to connect to MongoDB...');
  
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/office-plus', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      
      console.log('Successfully connected to MongoDB');
      console.log('Database name:', mongoose.connection.name);
      console.log('Connection state:', mongoose.connection.readyState);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        console.error('All connection attempts failed');
        throw error;
      }
      
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Initialize database connection
connectWithRetry().catch(error => {
  console.error('Failed to establish database connection:', error);
  process.exit(1);
});

// Monitor database connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  connectWithRetry().catch(console.error);
});

// Import models (in order of dependencies)
require('./models/Facility');
require('./models/Amenity');
require('./models/Building');
require('./models/Property');
require('./models/User');
require('./models/Booking');

// Routes
const propertiesRoutes = require('./routes/properties');
console.log('Models registered, setting up routes...');
app.use('/api/properties', propertiesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
