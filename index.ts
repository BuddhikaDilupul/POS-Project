import { Request, Response } from "express";
import { start, app } from "./src/services/express";
import * as functions from "@google-cloud/functions-framework";
import mongooseConnection from "./src/services/mongoose";
import config, { Config } from "./config";

// Type the config object
const configTyped: Config = config;

if (configTyped.enviroment === "DEV") {
  // Define and export the Cloud Function for the DEV environment
  functions.http(configTyped.enviroment_dev, (req: Request, res: Response) => {
    mongooseConnection.start(); // Connect to MongoDB
    app(req, res); // Handle the Express request
  });
} else if (configTyped.enviroment === "PROD") {
  // Define and export the Cloud Function for the PROD environment
  functions.http(configTyped.enviroment_prod, (req: Request, res: Response) => {
    mongooseConnection.start(); // Connect to MongoDB
    app(req, res); // Handle the Express request
  });
} else {
  // Local app start for other environments
  start();
  mongooseConnection.start();
}
