import { Request, Response } from "express";
import SuplierModel from "../../models/suplier/suplier.model";
import mongoose from "mongoose";
import { UserStatus } from "../../types/type";

// Create a new supplier
const createSuplier = async (req: Request, res: Response) => {
  const { name, contactNumber, address } = req.body;
  const lastUpdatedBy = req.userId; // assuming userId is attached to the request

  try {
    const newSuplier = new SuplierModel({
      name,
      contactNumber,
      address,
      lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
    });

    const savedSuplier = await newSuplier.save();
    res.status(201).json(savedSuplier);
  } catch (error: any) {
    if (error?.code === 11000) {
      return res
        .status(400)
        .json({ error: "Supplier contact number must be unique." });
    }
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get all suppliers
const getAllSupliers = async (req: Request, res: Response) => {
  try {
    const supliers = await SuplierModel.find({
      status: { $ne: UserStatus.DELETED },
    });
    res.status(200).json(supliers);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get supplier by ID
const getSuplierById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const suplier = await SuplierModel.findOne({
      _id: id,
      status: { $ne: UserStatus.DELETED },
    });
    if (!suplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.status(200).json(suplier);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Update a supplier
const updateSuplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, contactNumber, address, status } = req.body;
  const lastUpdatedBy = req.userId;

  try {
    const updatedSuplier = await SuplierModel.findByIdAndUpdate(
      id,
      {
        name,
        contactNumber,
        address,
        status,
        lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
      },
      { new: true, runValidators: true }
    );

    if (!updatedSuplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json(updatedSuplier);
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Supplier contact number must be unique." });
    }
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Soft delete a supplier
const deleteSuplier = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedSuplier = await SuplierModel.findByIdAndUpdate(id, {
      status: UserStatus.DELETED,
    });
    if (!deletedSuplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Export all controller functions
export default {
  createSuplier,
  getAllSupliers,
  getSuplierById,
  updateSuplier,
  deleteSuplier,
};
