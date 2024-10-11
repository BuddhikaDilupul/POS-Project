import mongoose, { Document, Schema } from "mongoose";
import { ProductStatus, Status, Unit } from "../../utils/types/type";

// Define the recipe interface
export interface IStocks extends Document {
  name: string;
  suplierId: mongoose.Types.ObjectId;
  ingredientId: mongoose.Types.ObjectId;
  initialStockCount: number;
  usedStockCount: number;
  inStockCount: number;
  damadgedCount: number;
  loss: number;
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
    loss: { type: Number, default: 0 },
    damadgedCount: { type: Number, default: 0 },
    initialStockCount: { type: Number, required: true },
    inStockCount: { type: Number, required: true },
    usedStockCount: { type: Number, default:0 },
    suplierId: { type: Schema.Types.ObjectId, required: true, ref: "Suplier" },
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
