import mongoose, { Document, Schema } from "mongoose";
import { UserStatus } from "../../utils/types/type";

// Define the Customer interface
export interface ICustomer extends Document {
  name: string;
  contactNumber: string;
  status: UserStatus;
  lastUpdatedBy: mongoose.Types.ObjectId;
}

// Create the schema
const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true, unique: true },
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
const CustomerModel = mongoose.model<ICustomer>("Customers", CustomerSchema);

export default CustomerModel;
