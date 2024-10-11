import express from "express";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import config from "../../config";
import apiRoutes from "../routes/index"; 
import { errorHandler } from "../middlewares/errorHandler";
import authJwt from "../middlewares/jwt";

// Import the generated Swagger documentation
let  swaggerDocument =  require('../../swagger-output.json');

export const app = express();
// Middleware setup
app.use(morgan("tiny"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const corsOptions: cors.CorsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
// Serve Swagger documentation at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// JWT middleware (if using JWT auth)
app.use(authJwt());

app.use(cors(corsOptions));

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // Limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again after an hour.",
});

// Apply the rate limiter to all requests
app.use(limiter);

// Main routes
app.use("/api", apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
export const start = (): void => {
  app.listen(config.port, (err?: any) => {
    if (err) {
      console.error(`Error: ${err}`);
      process.exit(-1);
    }
    console.log(`Backend Service is working at port ${config.port}`);
  });
};
