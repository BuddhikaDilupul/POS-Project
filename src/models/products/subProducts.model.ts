import mongoose, { Document, Schema } from "mongoose";
import { ProductStatus, Status } from "../../types/type";

// Define the sub-product interface
export interface ISubProduct extends Document {
  name: string;
  inStockQuantity: number;
  purchasedCost: number;
  sellingPrice: number;
  status: Status;
  availabilityStatus: ProductStatus;
  lastUpdatedBy: mongoose.Types.ObjectId;
}

// Create the schema
const SubProductSchema = new Schema<ISubProduct>(
  {
    name: { type: String, required: true },
    inStockQuantity: { type: Number, required: true },
    purchasedCost: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
      default: Status.ACTIVE,
    },
    availabilityStatus: {
      type: String,
      enum: Object.values(ProductStatus),
      required: true,
    },
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
const SubProductModel = mongoose.model<ISubProduct>(
  "SubProducts",
  SubProductSchema
);

export default SubProductModel;
