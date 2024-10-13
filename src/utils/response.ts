// responseUtil.ts
import { Response } from "express";

// Define the message interface
export interface IMessage {
  message?: string;
  data?: any;
}

// Create a reusable response function
export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
  error?: any,
  details?: any
) => {
  res.status(statusCode).json({ message: message, data, error, details });
};
// Create a reusable response function
export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  error?: any,
  details?: any
) => {
  res.status(statusCode).json({ error, details });
};
