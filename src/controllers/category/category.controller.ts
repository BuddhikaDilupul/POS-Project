import { Request, Response } from "express";
import CategoryModel from "../../models/category/category.model";
import { Status } from "../../utils/types/type";
import ProductModel from "../../models/products/products.model";

// Create a new category
const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const newCategory = new CategoryModel({
      name,
      lastUpdatedBy: req.userId,
    });

    const savedCategory = await newCategory.save();
    res
      .status(201)
      .json({ message: "Category created successfully", data: savedCategory });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Update an existing category
const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { name, lastUpdatedBy: req.userId },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get a list of all categories
const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find({
      status: { $ne: Status.DELETED },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get a single category by ID
const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await CategoryModel.findOne({
      _id: id,
      status: { $ne: Status.DELETED },
    });
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Delete a category (soft delete)
const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if there are any products associated with this recipe
    const associatedProducts = await ProductModel.find({
      categoryId: id,
      status: { $ne: Status.DELETED },
    });

    if (associatedProducts.length > 0) {
      return res.status(400).json({
        error:
          "Cannot delete category. It is associated with one or more products.",
      });
    }

    const deletedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { status: Status.DELETED }, // Set status to DELETED
      { new: true }
    );

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Export all controller functions
export default {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
};
