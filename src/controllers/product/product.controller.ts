import { Request, Response } from "express";
import mongoose from "mongoose";
import ProductModel from "../../models/products/products.model";
import { ProductStatus, Status } from "../../types/type";
import { uploadFile } from "../../middlewares/upload";
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

// Create a new product
const createProduct = async (req: Request, res: Response) => {
  const {
    recipeId,
    categoryId,
    description,
    sellingPrice,
    availabilityStatus,
  } = req.body;
  console.log(req.body);

  const lastUpdatedBy = req.userId; // assuming userId is attached to the request
  const file = req.file;

  let imageUrl: string | undefined;

  // Upload the file and get the fileName
  if (file) {
    const fileName = await uploadFile(file);
    console.log(`Uploaded file: ${fileName}`);
    imageUrl = fileName; // Construct the URL
    await unlinkFile(file.path);
  }

  try {
    const newProduct = new ProductModel({
      recipeId: new mongoose.Types.ObjectId(recipeId),
      categoryId: new mongoose.Types.ObjectId(categoryId),
      description,
      sellingPrice,
      imageUrl: imageUrl, // Save the image URL in the product document
      availabilityStatus: availabilityStatus || ProductStatus.IN_STOCK,
      lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
    });

    const data = await newProduct.save();
    res.status(201).json({ message: "Successfully updated", data });
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get all products with optional categoryId as a query parameter
const getAllProductsCategoryWise = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query; // Extract categoryId from query parameters

    const products = await ProductModel.find({
      status: { $ne: Status.DELETED },
      categoryId: categoryId,
    }).select(
      "name _id availabilityStatus sellingPrice description" // Only select these fields
    );

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get all products
const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find(
      {
        status: { $ne: Status.DELETED }, // Filter out DELETED status
      },
      "name _id availabilityStatus sellingPrice description" // Only select these fields
    );
    // .populate({
    //   path: "recipeId",
    //   select: "-lastUpdatedAt -createdAt -lastUpdatedBy -status", // Exclude fields from the recipe if necessary
    //   populate: {
    //     path: "ingredients.ingredientId", // Populate ingredientId inside ingredients array
    //     select: "name", // Include the name of the ingredient
    //   },
    // })
    // .populate({
    //   path: "categoryId",
    //   select: "-lastUpdatedAt -createdAt -lastUpdatedBy -status", // Exclude unnecessary fields from category
    // });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get product by ID
const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id)
      .populate({
        path: "recipeId",
        select: "-lastUpdatedAt -createdAt -lastUpdatedBy -status", // You can exclude fields from the recipe if necessary
      })
      .populate({
        path: "categoryId",
        select: "-lastUpdatedAt -createdAt -lastUpdatedBy -status", // Exclude the 'lastUpdatedAt' field from the populated category
      });
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
const updateProduct = async (req: Request, res: Response) => {
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
const deleteProduct = async (req: Request, res: Response) => {
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

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsCategoryWise
};
