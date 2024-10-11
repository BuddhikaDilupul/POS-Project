import { Request, Response } from "express";
import mongoose from "mongoose";
import SubProductModel from "../../models/products/subProducts.model";
import { ProductStatus, Status } from "../../types/type";
import { uploadFile } from "../../middlewares/upload";
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
// Create a new sub-product
const createSubProduct = async (req: Request, res: Response) => {
  const {
    name,
    inStockQuantity,
    purchasedCost,
    sellingPrice,
    availabilityStatus,
  } = req.body;
  const lastUpdatedBy = req.userId; // Assuming userId is attached to the request object
  const file = req.file;

  let imageUrl: string | undefined;

  // Upload the file and get the fileName
  if (file) {
    const fileName = await uploadFile(file);
    imageUrl = fileName; // Construct the URL
    await unlinkFile(file.path);
  }

  try {
    const newSubProduct = new SubProductModel({
      name,
      inStockQuantity,
      initialStockCount: inStockQuantity,
      purchasedCost,
      sellingPrice,
      availabilityStatus: availabilityStatus || ProductStatus.IN_STOCK, // Default to IN_STOCK
      lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
    });

    const savedSubProduct = await newSubProduct.save();
    res.status(201).json(savedSubProduct);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Get all sub-products
const getAllSubProducts = async (req: Request, res: Response) => {
  try {
    const subProducts = await SubProductModel.find({
      status: { $ne: Status.DELETED &&  Status.CLOSED },

    });
    res.status(200).json(subProducts);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Get a sub-product by ID
const getSubProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const subProduct = await SubProductModel.findById(id);
    if (!subProduct || subProduct.status === Status.DELETED) {
      return res.status(404).json({ error: "SubProduct not found" });
    }
    res.status(200).json(subProduct);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Update a sub-product
const updateSubProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, inStockQuantity, purchasedCost, status, availabilityStatus } =
    req.body;
  const lastUpdatedBy = req.userId;

  try {
    const updatedSubProduct = await SubProductModel.findByIdAndUpdate(
      id,
      {
        name,
        inStockQuantity,
        purchasedCost,
        status,
        availabilityStatus,
        lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
      },
      { new: true, runValidators: true }
    );

    if (!updatedSubProduct || updatedSubProduct.status === Status.DELETED) {
      return res.status(404).json({ error: "SubProduct not found" });
    }

    res.status(200).json(updatedSubProduct);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Soft delete a sub-product (change status to DELETED)
const deleteSubProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedSubProduct = await SubProductModel.findByIdAndUpdate(
      id,
      { status: Status.DELETED }, // Change status to DELETED
      { new: true }
    );
    if (!deletedSubProduct) {
      return res.status(404).json({ error: "SubProduct not found" });
    }

    res.status(200).json({ message: "SubProduct deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export default {
  createSubProduct,
  getAllSubProducts,
  getSubProductById,
  updateSubProduct,
  deleteSubProduct,
}