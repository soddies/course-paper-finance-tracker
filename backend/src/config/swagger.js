const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Finance Tracker API',
            version: '1.0.0',
            description: 'API для управления финансами, транзакциями и аналитикой',
            contact: {
                name: 'Ekaterina Pchelkina',
                email: 'ktrn.pchelkina@gmail.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Локальный сервер'
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routers/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;