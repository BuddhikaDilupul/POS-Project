import crypto from "crypto";
// Encryption settings
const ALGORITHM = "aes-256-cbc"; // AES algorithm
const ENCRYPTION_KEY = crypto.randomBytes(32); // Generate a 32-byte key (256 bits)
const IV_LENGTH = 16; // AES requires a 16-byte IV (Initialization Vector)

// import crypto from 'crypto';

// const ALGORITHM = 'aes-256-cbc'; // Make sure this matches your use case
// const IV_LENGTH = 16; // AES block size

// Function to decrypt NIC
export const decryptNIC = (encryptedNIC: string, iv: string, ENCRYPTION_KEY: string): string => {
  const keyBuffer = Buffer.from(ENCRYPTION_KEY.padEnd(32, 'a')); // Adjust to 32 bytes
  console.log("Decryption Key:", keyBuffer.toString('hex'));
  console.log("IV (Decryption):", iv);
  console.log("Encrypted NIC:", encryptedNIC);
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    keyBuffer,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedNIC, "hex", "utf8");
  decrypted += decipher.final("utf8");
  console.log(decrypted, "hello");
  
  return decrypted;
};

// Function to encrypt NIC
export const encryptNIC = (nic: string, ENCRYPTION_KEY: string): { encryptedData: string; iv: string } => {
  const keyBuffer = Buffer.from(ENCRYPTION_KEY.padEnd(32, 'a')); // Adjust to 32 bytes
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
  let encrypted = cipher.update(nic, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedData: encrypted, iv: iv.toString("hex") };
};

