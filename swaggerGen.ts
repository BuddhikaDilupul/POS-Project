const swaggerAutogen = require('swagger-autogen')();

const isLocal = false; // Check if the environment is local

const doc = {
  info: {
    title: 'API Documentation',
    description: 'API documentation for the project',
  },
  host: isLocal ? 'localhost:4040' : 'us-central1-pos-kandy.cloudfunctions.net/kandy-posapplication',
  schemes: [isLocal ? 'http' : 'https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/services/express']; // Point to your main routes file

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./src/services/express'); // This points to your express app entry point
});
