import { expressjwt as jwt } from 'express-jwt';
import config from '../../config';

const authJwt = () => {
  return jwt({
    secret: config.secret,
    algorithms: ['HS256'],
  }).unless({
    // Non-token URLs
    path: [
      '/api/user/v1/login',
      '/api-docs/', // Allow the main Swagger documentation path
      '/api-docs/swagger-ui.css', // CSS file
      '/api-docs/swagger-ui-bundle.js', // JavaScript bundle
      '/api-docs/swagger-ui-standalone-preset.js', // Standalone preset
      '/api-docs/swagger-ui-init.js', // Init file
      '/api-docs/favicon-32x32.png', // Favicon
      '/api-docs/favicon-16x16.png', // Favicon
      // Add any other static assets if needed
    ],
  });
};


export default authJwt;
