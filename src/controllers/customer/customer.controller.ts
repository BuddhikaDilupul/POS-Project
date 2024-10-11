import { Request, Response } from "express";
import CustomerModel from "../../models/customer/customer.model";
import mongoose from "mongoose";
import { UserStatus } from "../../utils/types/type";

// Create a new customer
const createCustomer = async (req: Request, res: Response) => {
  const { name, contactNumber } = req.body;
  const lastUpdatedBy = req.userId; // assuming userId is attached to the request

  try {
    const newCustomer = new CustomerModel({
      name,
      contactNumber,
      lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error: any) {
    if (error?.code === 11000) {
      return res
        .status(400)
        .json({ error: "Customer contact number must be unique." });
    }
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get all customers
const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await CustomerModel.find({
      status: { $ne: UserStatus.DELETED },
    });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get customer by ID
const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const customer = await CustomerModel.findOne({
      _id: id,
      status: { $ne: UserStatus.DELETED },
    });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Update a customer
const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, contactNumber } = req.body;
  const lastUpdatedBy = req.userId;

  try {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      id,
      {
        name,
        contactNumber,
        lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
      },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Customer contact number must be unique." });
    }
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Delete a customer
const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCustomer = await CustomerModel.findByIdAndUpdate(id, {
      status: UserStatus.DELETED,
    });
    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Export all controller functions
export default {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
