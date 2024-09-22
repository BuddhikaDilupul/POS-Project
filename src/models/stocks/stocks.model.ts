import mongoose, { Document, Schema } from "mongoose";
import { ProductStatus, Status, Unit } from "../../types/type";

// Define the recipe interface
export interface IStocks extends Document {
  name: string;
  ingredientId: mongoose.Types.ObjectId;
  inStockCount: number;
  availabilityStatus: ProductStatus;
  status: Status;
  unitPrice: number;
  unitType: Unit;
  expireDate: Date;
  lastUpdatedBy: mongoose.Types.ObjectId;
}

// Create the schema
const StockSchema = new Schema<IStocks>(
  {
    name: { type: String, required: true },
    ingredientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Ingredients",
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
      required: true,
    },
    unitType: { 
      type: String, 
      enum: Object.values(Unit), 
      required: true,
    },
    inStockCount: { type: Number, required: true },
    availabilityStatus: {
      type: String,
      enum: Object.values(ProductStatus),
      required: true,
    },
    unitPrice: { type: Number, required: true },
    expireDate: { type: Date, required: true },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "lastUpdatedAt" },
  }
);

// Create the model
const StockModel = mongoose.model<IStocks>("Stocks", StockSchema);

export default StockModel;
