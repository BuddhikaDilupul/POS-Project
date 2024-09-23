import { Request, Response } from "express";
import mongoose from "mongoose";
import ProductAddonModel from "../../models/products/productsaddons.model";
import { Status, ProductStatus } from "../../types/type";

// Create a new product addon
export const createProductAddon = async (req: Request, res: Response) => {
  const { stockId, ingredientsId, sellingQuantity, sellingPrice, availabilityStatus } = req.body;
  const lastUpdatedBy = req.userId; // assuming `userId` is attached to the request

  try {
    const newProductAddon = new ProductAddonModel({
      stockId: new mongoose.Types.ObjectId(stockId),
      ingredientsId: new mongoose.Types.ObjectId(ingredientsId),
      sellingQuantity,
      sellingPrice,
      availabilityStatus: availabilityStatus || ProductStatus.IN_STOCK, // Default to IN_STOCK if not provided
      lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
    });

    const savedProductAddon = await newProductAddon.save();
    res.status(201).json(savedProductAddon);
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get all product addons
export const getAllProductAddons = async (req: Request, res: Response) => {
  try {
    const productAddons = await ProductAddonModel.find({ status: { $ne: Status.DELETED } });
    res.status(200).json(productAddons);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get a product addon by ID
export const getProductAddonById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const productAddon = await ProductAddonModel.findById(id)
      .populate("stockId")
      .populate("ingredientsId");
    if (!productAddon || productAddon.status === Status.DELETED) {
      return res.status(404).json({ error: "ProductAddon not found" });
    }
    res.status(200).json(productAddon);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Update a product addon
export const updateProductAddon = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stockId, ingredientsId, sellingQuantity, sellingPrice, availabilityStatus } = req.body;
  const lastUpdatedBy = req.userId;

  try {
    const updatedProductAddon = await ProductAddonModel.findByIdAndUpdate(
      id,
      {
        stockId: stockId ? new mongoose.Types.ObjectId(stockId) : undefined,
        ingredientsId: ingredientsId ? new mongoose.Types.ObjectId(ingredientsId) : undefined,
        sellingQuantity,
        sellingPrice,
        availabilityStatus,
        lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
      },
      { new: true, runValidators: true }
    );

    if (!updatedProductAddon || updatedProductAddon.status === Status.DELETED) {
      return res.status(404).json({ error: "ProductAddon not found" });
    }

    res.status(200).json(updatedProductAddon);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Soft delete a product addon (change status to DELETED)
export const deleteProductAddon = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedProductAddon = await ProductAddonModel.findByIdAndUpdate(
      id,
      { status: Status.DELETED }, // Change status to DELETED
      { new: true }
    );
    if (!deletedProductAddon) {
      return res.status(404).json({ error: "ProductAddon not found" });
    }

    res.status(200).json({ message: "ProductAddon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};
