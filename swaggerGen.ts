const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Documentation',
    description: 'API documentation for the project',
  },
  host: 'localhost:4040', // Update this with your actual host/port
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/services/express']; // Point to your main routes file

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./src/services/express'); // This points to your express app entry point
});
