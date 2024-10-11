import mongoose, { Document, Schema } from "mongoose";
import { EmploymentTypeStaff, Gender, StaffRoles, Status } from "../../utils/types/type";

// Define the Staff interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  gender: Gender;
  address?: string;
  contactNumber: string;
  joinedDate: Date;
  email: string;
  username: string;
  password: string;
  employmentType: EmploymentTypeStaff;
  role: StaffRoles;
  status: Status;
  lastLogin: Date;
  currentLogin: Date;
  lastUpdatedBy?: mongoose.Types.ObjectId;
}

// Create the schema
const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: Object.values(Gender), required: true },
    role: { type: String, enum: Object.values(StaffRoles), required: true },
    status: { type: String, enum: Object.values(Status), default: Status.ACTIVE },
    address: { type: String },
    contactNumber: { type: String, required: true },
    joinedDate: { type: Date, required: true },
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    employmentType: {
      type: String,
      enum: Object.values(EmploymentTypeStaff),
      required: true,
    },
    lastLogin: { type: Date },
    currentLogin: { type: Date },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "lastUpdatedAt" },
  }
);

// Create the model
const UserModel = mongoose.model<IUser>("Users", UserSchema);

export default UserModel;