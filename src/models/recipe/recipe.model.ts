import mongoose, { Document, Schema } from "mongoose";
import { Status, Unit } from "../../types/type";

// Define the recipe interface
export interface IRecipe extends Document {
  name: string;
  status: Status;
  ingredients: {
    ingredientId: mongoose.Types.ObjectId;
    quantity: number;
    quantityType: Unit;
  }[];
  lastUpdatedBy: mongoose.Types.ObjectId;
}

// Create the schema
const RecipeSchema = new Schema<IRecipe>(
  {
    name: { type: String, required: true },
    status: { type: String, enum: Object.values(Status), default: Status.ACTIVE, required: true },
    ingredients: [
      {
        ingredientId: { type: Schema.Types.ObjectId, required: true },
        quantityType: { type: String, enum: Object.values(Unit), required: true },
        quantity: { type: Number, required: true },
      },
    ],
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
const RecipeModel = mongoose.model<IRecipe>("Recipes", RecipeSchema);

export default RecipeModel;
