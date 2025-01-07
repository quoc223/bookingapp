// db.js
const mysql = require('mysql2/promise');  // Note: using mysql2/promise directly
require('dotenv').config({ path: './.env' });

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Simple test query to verify connection
const   testConnection = async () => {
  try {
    // Test the connection by running a simple query
    await pool.query('SELECT 1');
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);  // Exit if connection fails
  }
};

// Run the test
testConnection();

// Export the pool
module.exports = pool;
