import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../../config";
import { IUser } from "../../models/user/user.model";
import { IUser_Custom } from "types/interfaces";
import { encryptNIC, decryptNIC } from "../../helpers/encryption";
import mongoose from "mongoose";
import UserModel from "../../models/user/user.model";
// Constants
const SALT_ROUNDS = 10;

// Controller function to save a user member
const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData: IUser = req.body;
    const {
      firstName,
      lastName,
      gender,
      address,
      contactNumber,
      joinedDate,
      email,
      password,
      employmentType,
      role,
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Prepare user data with hashed password and encrypted NIC
    const userToSave = new UserModel({
      firstName,
      lastName,
      gender,
      address,
      contactNumber,
      joinedDate,
      email,
      password: hashedPassword,
      employmentType,
      role,
      lastUpdatedBy: req.userId,
    });

    // Save the user data to MongoDB
    const savedUser = await userToSave.save();

    res.status(201).json({
      message: "User member created successfully",
      id: savedUser._id,
    });
  } catch (error) {
    next(error);
  }
};

// Controller function to login a user member
const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Fetch the user from MongoDB
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(404).send("User not found!!");
      return;
    }

    // Compare the password with the hashed password in MongoDB
    if (bcrypt.compareSync(password, user.password)) {
      const secret = config.secret;

      // Create a token
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          email: user.email,
          username: `${user.firstName} ${user.lastName}`,
        },
        secret,
        { expiresIn: "1d" }
      );
      // Update lastLogin and currentLogin
      const currentDate = new Date();
      const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        {
          lastLogin: user.currentLogin || currentDate, // Set lastLogin to the previous currentLogin if it exists
          currentLogin: currentDate, // Set currentLogin to now
        },
        { new: true } // Return the updated document
      );
      if (updatedUser && token) {
        res.status(200).send({
          token,
          lastLogin: updatedUser.lastLogin,
          curruntLogin: updatedUser.currentLogin,
        });
      } else {
        res.status(400).send("Somthing went wrong!");
      }
    } else {
      res.status(400).send("Password is wrong!");
    }
  } catch (error) {
    next(error);
  }
};

// Controller function to update password
const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Fetch the user member from MongoDB
    const user = await UserModel.findOne({ email: req.email });

    if (!user) {
      res.status(404).send("User not found!!");
      return;
    }

    // Validate the current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      res.status(400).send("Current password is incorrect!");
      return;
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    if (req.userId) {
      // Update the user member's password
      user.password = hashedNewPassword;
      user.lastUpdatedBy = new mongoose.Types.ObjectId(req.userId);
      await user.save();
    }
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

const updateUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      gender,
      address,
      contactNumber,
      nic,
      employmentType,
    } = req.body;
    const email = req.email;

    // Fetch the user member by email
    const user = await UserModel.findOne({ email });

    if (user) {
      // Check if NIC or email is in use by another user member
      const nicInUse = await UserModel.findOne({ nic });
      if (nicInUse && nicInUse.email !== email) {
        res
          .status(400)
          .json({ message: "NIC is already in use by another user member." });
      }

      const emailInUse = await UserModel.findOne({ email: email });
      if (emailInUse && emailInUse.email !== email) {
        res.status(400).json({
          message: "Email is already in use by another user member.",
        });
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.gender = gender || user.gender;
      user.address = address || user.address;
      user.contactNumber = contactNumber || user.contactNumber;
      user.employmentType = employmentType || user.employmentType;
      user.lastUpdatedBy = new mongoose.Types.ObjectId(req.userId);

      await user.save();

      res.status(200).json({ message: "User details updated successfully" });
    } else {
      res.status(404).json({ message: "User member not found" });
    }
  } catch (error) {
    next(error);
  }
};

// Controller to get all user members
const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users: IUser_Custom[] | null = await UserModel.find().select(
      "_id firstName lastName" // Select only _id, firstName, and lastName fields
    );
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Controller to get a specific user member by ID
const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Fetch the user member by ID
    const user: IUser_Custom | null = await UserModel.findById(id).select(
      "-password"
    );
    if (user) {
      res.status(200).json(user); // Send the result back
    }

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
  } catch (error) {
    next(error); // Forward the error to the error handling middleware
  }
};

// Export all controller functions
export default {
  createUser,
  login,
  updatePassword,
  updateUserDetails,
  getAllUser,
  getUserById,
};
