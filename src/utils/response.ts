// responseUtil.ts
import { Response } from "express";

// Create a reusable response function
export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string | null,
  data?: any
) => {
  res.status(statusCode).json({ message: message, data });
};
