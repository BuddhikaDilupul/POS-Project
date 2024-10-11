// responseUtil.ts
import { Response } from "express";

// Define the message interface
export interface IMessage {
    message?: string;
}

// Create a reusable response function
export const sendResponse = (res: Response, statusCode: number, message: IMessage, data: any) => {
    res.status(statusCode).json({ message: message.message, data });
};
