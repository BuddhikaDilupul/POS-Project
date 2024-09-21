import mongoose, { Document, Schema } from "mongoose";
import { EmploymentTypeStaff, Gender, StaffRoles, Status, Unit } from "../../types/type";

// Define the Staff interface
export interface IIngredients extends Document {
  name: string;
  unit: Unit;
  status: Status;
  lastUpdatedBy: mongoose.Types.ObjectId;
}

// Create the schema
const IngredientsSchema = new Schema<IIngredients>(
  {
    name: { type: String, required: true },
    unit: { type: String, enum: Object.values(Unit), required: true },
    status: { type: String, enum: Object.values(Status), default: Status.ACTIVE, required: true },
    lastUpdatedBy: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "lastUpdatedAt" },
  }
);

// Create the model
const IngredientsModel = mongoose.model<IIngredients>("Ingredients", IngredientsSchema);

export default IngredientsModel;
