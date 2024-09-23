import mongoose, { Document, Schema } from "mongoose";
import { Status } from "../../types/type";

// Define the CashInHand interface
export interface ICashInHand extends Document {
  cash: number;
  status: Status;
  date: Date;
  lastUpdatedBy: mongoose.Types.ObjectId;
}

// Create the schema
const ICashInHandSchema = new Schema<ICashInHand>(
  {
    cash: { type: Number, required: true },
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
const ICashInHandModel = mongoose.model<ICashInHand>("CashInHand", ICashInHandSchema);

export default ICashInHandModel;