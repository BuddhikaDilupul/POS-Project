import { EmploymentTypeStaff, Gender, StaffRoles } from "./type";

// Define the User interface
export interface IUser_Custom extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  gender: Gender;
  address: string;
  contactNumber: string;
  joinedDate: Date;
  email?: string;
  status?: string;
  employmentType: EmploymentTypeStaff;
  role: StaffRoles;
  createdAt: Date;
  lastUpdatedAt: Date;
  lastLogin: Date;
  currentLogin: Date;
  lastUpdatedBy?: string;
}

// Define the customer interface
export interface ICustomer_Custom extends Document {
  name: string;
  gender: Gender;
  contactNumber: string;
  email?: string;
  lastUpdatedAt?: Date;
  lastUpdatedBy?: string;
}
