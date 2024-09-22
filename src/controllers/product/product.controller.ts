import { Request, Response } from "express";
import mongoose from "mongoose";
import ProductModel from "../../models/products/products.model";
import { ProductStatus, Status } from "../../types/type";

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  const {
    recipeId,
    categoryId,
    description,
    sellingPrice,
    availabilityStatus,
  } = req.body;
  const lastUpdatedBy = req.userId; // assuming userId is attached to the request

  try {
    const newProduct = new ProductModel({
      recipeId: new mongoose.Types.ObjectId(recipeId),
      categoryId: new mongoose.Types.ObjectId(categoryId),
      description,
      sellingPrice,
      availabilityStatus: availabilityStatus || ProductStatus.IN_STOCK, // Default to IN_STOCK if not provided
      lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find({
      status: { $ne: Status.DELETED },
    })
      .populate({
        path: "recipeId",
        select: "-lastUpdatedAt -createdAt -lastUpdatedBy -status", // You can exclude fields from the recipe if necessary
      })
      .populate({
        path: "categoryId",
        select: "-lastUpdatedAt -createdAt -lastUpdatedBy -status", // Exclude the 'lastUpdatedAt' field from the populated category
      });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id).populate({
      path: "recipeId",
      select: "-lastUpdatedAt -createdAt -lastUpdatedBy -status", // You can exclude fields from the recipe if necessary
    })
    .populate({
      path: "categoryId",
      select: "-lastUpdatedAt -createdAt -lastUpdatedBy -status", // Exclude the 'lastUpdatedAt' field from the populated category
    });;
    // .populate("categoryId");
    if (!product || product.status === Status.DELETED) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    recipeId,
    categoryId,
    description,
    sellingPrice,
    status,
    availabilityStatus,
  } = req.body;
  const lastUpdatedBy = req.userId;

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        recipeId: recipeId ? new mongoose.Types.ObjectId(recipeId) : undefined,
        categoryId: categoryId
          ? new mongoose.Types.ObjectId(categoryId)
          : undefined,
        description,
        sellingPrice,
        status,
        availabilityStatus,
        lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct || updatedProduct.status === Status.DELETED) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Soft delete a product (Change status to DELETED)
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { status: Status.DELETED }, // Set status to DELETED
      { new: true }
    );
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};
