import mongoose, { Document, Schema } from "mongoose";
import { ProductStatus, Status } from "../../types/type";
import { IRecipe } from "models/recipe/recipe.model";

// Define the product interface
export interface IProduct extends Document {
  recipeId: mongoose.Types.ObjectId | IRecipe;
  categoryId: mongoose.Types.ObjectId;
  description: string;
  sellingPrice: number;
  status: Status;
  availabilityStatus: ProductStatus;
  lastUpdatedBy: mongoose.Types.ObjectId;
}

// Create the schema
const ProductSchema = new Schema<IProduct>(
  {
    recipeId: { type: Schema.Types.ObjectId, required: true, ref: "Recipes" },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    description: { type: String, required: true },
    sellingPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
      required: true,
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
const ProductModel = mongoose.model<IProduct>("Products", ProductSchema);

export default ProductModel;
