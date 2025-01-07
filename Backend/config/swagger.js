const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Định nghĩa thông tin cơ bản cho API
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation for the Express API',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Thay URL này thành URL của bạn
            },
        ],
    },
    apis: ['./routes/*.js'], // Chỉ định đường dẫn chứa các định nghĩa endpoint
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
