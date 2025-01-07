require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
// const path = require('path');
const { initializeRedis } = require('./utils/redis');
const cookieParser = require('cookie-parser');
const app = express();
const http = require('http').createServer(app);




// Socket.IO setup
const io = require('socket.io')(http, {
  cors: {
    origin: process.env.FRONTEND_URL, // Frontend URL
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (cookies)
  }
});

// Initialize Redis before setting up routes
const startServer = async () => {
  try {
    // Initialize Redis
    await initializeRedis();

    // Middleware setup
    const corsOptions = {
      origin: ['http://localhost:5173', 'https://e040-115-78-231-117.ngrok-free.app/'], // Frontend URL
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    };
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.options('*', cors(corsOptions)); // Handle preflight requests

    // Store io instance in app
    app.set('io', io);

    // Import routes

    const authRoutes = require('./routes/userroutes');
    const doctorRoutes = require('./routes/doctorRoutes');
    const patientRoutes = require('./routes/patientRoutes');
    const blogRoutes = require('./routes/blogRoutes');
    const specialtiesRoutes = require('./routes/specialtiesRoutes');
    const serviceRoutes = require('./routes/serviceRoutes');
    const reviewRoutes = require('./routes/reviewRoutes');
    const notifyRoutes = require('./routes/notifyRoutes');
    const appointmentRoutes = require('./routes/appointmentRoutes');
    const doctorContactRoutes = require('./routes/doctorContactRoutes');
    const paymentRoutes = require('./routes/paymentRoutes');
    const dashboardRoutes = require('./routes/dashboardRoutes');
    const chatRoutes =require('./routes/chatRoutes.js') ;
    // Route setup

    app.use('/api',appointmentRoutes)
    app.use('/api', authRoutes);
    app.use('/api', doctorRoutes);
    app.use('/api', patientRoutes);
    app.use('/api', specialtiesRoutes);
    app.use('/api', serviceRoutes);
    app.use('/api', reviewRoutes);
    app.use('/api', notifyRoutes);
    app.use('/api', blogRoutes);
    app.use('/api', chatRoutes);
    app.use('/api', doctorContactRoutes);
    app.use('/payments', paymentRoutes);
    app.use('/api', dashboardRoutes);
    // Socket.IO Connection
    io.on('connection', (socket) => {
      console.log('User connected');
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    http.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
