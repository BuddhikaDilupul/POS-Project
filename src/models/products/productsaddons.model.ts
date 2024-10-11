import mongoose, { Document, Schema } from "mongoose";
import { ProductStatus, Status } from "../../types/type";

// Define the ProductAddons interface
export interface IProductAddon extends Document {
  stockId: mongoose.Types.ObjectId;
  ingredientsId: mongoose.Types.ObjectId;
  imageUrl: string;
  sellingQuantity: number;
  sellingPrice: number;
  status: Status;
  availabilityStataus: ProductStatus;
  lastUpdatedBy: mongoose.Types.ObjectId;
}

// Create the schema
const ProductAddonSchema = new Schema<IProductAddon>(
  {
    stockId: { type: Schema.Types.ObjectId, required: true, ref: "Stocks" },
    ingredientsId: { type: Schema.Types.ObjectId, required: true, ref: "Ingredients" },
    sellingQuantity: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    sellingPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
      default:Status.ACTIVE
    },
    availabilityStataus: {
      type: String,
      enum: Object.values(ProductStatus),
      required: true,
    },
    lastUpdatedBy: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "lastUpdatedAt" },
  }
);

// Create the model
const ProductAddonModel = mongoose.model<IProductAddon>("ProductAddons", ProductAddonSchema);

export default ProductAddonModel;
