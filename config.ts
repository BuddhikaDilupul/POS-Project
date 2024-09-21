import * as dotenv from "dotenv";

// Load environment variables from a .env file into process.env
dotenv.config();

export interface Config {
  port: number;
  mongoUri: string,
  mongoUriDev: string,
  enviroment: string;
  enviroment_dev: string;
  enviroment_prod: string;
  secret: string;
  encryption_key: string;
  salt_rounds: string;
}
const config: Config = {
  port: parseInt(process.env.PORT || "4041", 10),
  enviroment: process.env.ENVIROMENT || "LOCAL",
  mongoUri: process.env.MONGO_URL|| "",
  mongoUriDev: process.env.MONGO_URL_DEV|| "",
  enviroment_dev: process.env.ENVIROMENT_DEV || "",
  enviroment_prod: process.env.ENVIROMENT_PROD || "",
  secret: process.env.SECRET || "",
  salt_rounds: process.env.SALT_ROUNDS || "10",
  encryption_key: process.env.ENCRYPTION_KEY || "",
};

export default config;
