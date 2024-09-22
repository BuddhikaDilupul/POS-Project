import mongoose, { Document, Schema } from "mongoose";
import { UserStatus } from "../../types/type";

// Define the Customer interface
export interface ISuplier extends Document {
  name: string;
  contactNumber: string;
  address: string;
  status: UserStatus;
  lastUpdatedBy: mongoose.Types.ObjectId;
}

// Create the schema
const SuplierSchema = new Schema<ISuplier>(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
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
const SuplierModel = mongoose.model<ISuplier>("Suplier", SuplierSchema);

export default SuplierModel;
