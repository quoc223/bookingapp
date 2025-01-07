const { createClient } = require('redis');

let redisClient = null;

const initializeRedis = async () => {
    try {
        redisClient = createClient({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        console.error('Max redis reconnection attempts reached');
                        return new Error('Max redis reconnection attempts reached');
                    }
                    return Math.min(retries * 100, 3000);
                }
            },
            password: process.env.REDIS_PASSWORD,
            database: process.env.REDIS_DB || 0
        });

        redisClient.on('error', (err) => {
            console.error('Redis error:', err);
        });

        redisClient.on('connect', () => {
            console.log('Connected to Redis');
        });

        await redisClient.connect();

        return redisClient;
    } catch (error) {
        console.error('Redis initialization error:', error);
        throw error;
    }
};

const getRedisClient = () => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
};

module.exports = { initializeRedis, getRedisClient };
