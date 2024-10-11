import mongoose, { Document, Schema } from "mongoose";
import { Status } from "../../utils/types/type";

// Define the sub-product interface
export interface ICategory extends Document {
  name: string;
  status: Status;
  lastUpdatedBy: mongoose.Types.ObjectId;
}

// Create the schema
const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
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
const CategoryModel = mongoose.model<ICategory>("Category", CategorySchema);

export default CategoryModel;
