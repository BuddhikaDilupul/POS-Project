import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import path from "path";
import config from "../../config";
import fs from "fs";
const bucketName = config.bucket;
const region = config.region;
const accessKeyId = config.accessKeyId;
const secretAccessKey = config.secretAccessKey;

// Configure AWS S3
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Helper function to determine content type
const getContentType = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream"; // Fallback content type
  }
};

// Uploads a file to S3
export const uploadFile = async (file: Express.Multer.File): Promise<any> => {
  const fileStream = fs.createReadStream(file.path);

  // Use the original file name (or modify it as needed)
  const originalFilename = path.basename(file.originalname);
  const fileName = Math.floor(Date.now() / 1000) + originalFilename
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: fileName, // Set Key to include the original filename
    ContentType: getContentType(originalFilename), // Set content type
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);
  
  return fileName; // Return the fileName
};

// Downloads a file from S3
export const getFileStream = async (
  fileKey: string
): Promise<NodeJS.ReadableStream> => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  const command = new GetObjectCommand(downloadParams);
  const { Body } = await s3Client.send(command);

  return Body as NodeJS.ReadableStream;
};
