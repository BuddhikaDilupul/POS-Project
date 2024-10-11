import { File } from 'multer';

declare module 'multer' {
  interface File {
    location: string; // Add the location property
  }
}
