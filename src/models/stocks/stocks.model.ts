import mongoose, { Document, Schema } from "mongoose";
import { Status, Unit } from "../../types/type";

// Define the recipe interface
export interface IStocks extends Document {
  name: string;
  ingredientId: mongoose.Types.ObjectId;
  inStockCount: Number;
  status: Status;
  unitPrice: Number;
  expireDate: Date;
  lastUpdatedBy: mongoose.Types.ObjectId;
}

// Create the schema
const StockSchema = new Schema<IStocks>(
  {
    name: { type: String, required: true },
    ingredientId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, enum: Object.values(Status), required: true },
    inStockCount: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    expireDate: { type: Date, required: true },
    lastUpdatedBy: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "lastUpdatedAt" },
  }
);

// Create the model
const StockModel = mongoose.model<IStocks>("Stocks", StockSchema);

export default StockModel;
