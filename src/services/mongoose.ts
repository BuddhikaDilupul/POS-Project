import mongoose from "mongoose";
import config from "../../config";

// Define a type for the configuration to ensure type safety
interface Config {
  environment: string;
  mongoUri: string;
  mongoUriDev: string;
}

const start = (): void => {
  try {
    const db: string =
      config.enviroment === "PROD" ? config.mongoUri : config.mongoUriDev;
    
    console.log(db);
    
    mongoose.set("strictQuery", false);
    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    
    console.log("Connected to MongoDB!!!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit with failure code
  }
};
export default {
    start
}