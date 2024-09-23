import { Request, Response } from "express";
import mongoose from "mongoose";
import StockModel from "../../models/stocks/stocks.model";
import { Status, ProductStatus } from "../../types/type";
import IngredientsModel from "../../models/ingredients/ingredients.model";

// Create a new stock
const createStock = async (req: Request, res: Response) => {
  const {
    name,
    suplierId, // New field
    ingredientId,
    inStockCount,
    availabilityStatus,
    unitPrice,
    unitType,
    expireDate,
  } = req.body;
  const lastUpdatedBy = req.userId;

  try {
    const stock = new StockModel({
      name,
      suplierId: new mongoose.Types.ObjectId(suplierId), // Adding supplier ID
      ingredientId: new mongoose.Types.ObjectId(ingredientId),
      inStockCount,
      availabilityStatus: availabilityStatus || ProductStatus.IN_STOCK, // Default to IN_STOCK if not provided
      unitPrice,
      unitType,
      expireDate,
      lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
    });

    const savedStock = await stock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    res.status(500).json({ error: "Failed to create stock", details: error });
  }
};

// Get all stocks (excluding deleted ones)
const getAllStocks = async (req: Request, res: Response) => {
  try {
    const stocks = await StockModel.find({ status: { $ne: Status.DELETED } })
      .populate({
        path: "ingredientId",
        select: "-lastUpdatedAt -createdAt -lastUpdatedBy -status", // Exclude unnecessary fields
      })
      .populate({
        path: "suplierId",
        select: "name contactNumber", // Populate supplier details
      });

    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stocks", details: error });
  }
};

// Get stock by ID
const getStockById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const stock = await StockModel.findOne({
      _id: id,
      status: { $ne: Status.DELETED },
    })
      .populate("ingredientId")
      .populate("suplierId"); // Populate supplier details

    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock", details: error });
  }
};

// Update a stock
const updateStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    ingredientId, // Should be a valid ObjectId
    inStockCount,
    availabilityStatus,
    status,
    unitPrice,
    unitType,
    expireDate,
  } = req.body;

  // Validate stock ID (ensure it's a valid ObjectId)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid stock ID" });
  }

  // Validate ingredientId if provided
  if (ingredientId && !mongoose.Types.ObjectId.isValid(ingredientId)) {
    return res.status(400).json({ error: "Invalid ingredient ID" });
  }

  try {
    const updatedStock = await StockModel.findByIdAndUpdate(
      id,
      {
        name,
        ingredientId: ingredientId
          ? new mongoose.Types.ObjectId(ingredientId)
          : undefined, // Convert if provided
        inStockCount,
        availabilityStatus,
        status,
        unitPrice,
        unitType,
        expireDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res.status(200).json(updatedStock);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Failed to update stock", details: error.message });
  }
};

// Soft delete a stock (Change status to DELETED)
const deleteStock = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if the stock exists and is active
    const stock = await StockModel.findOne({
      _id: id,
      status: Status.ACTIVE,
    })
      .populate("ingredientId")
      .populate("suplierId"); // Populate supplier details

    if (!stock) {
      return res
        .status(404)
        .json({ error: "Stock not found or already deleted." });
    }

    // Check if there are other active stocks associated with this ingredient
    const associatedStocks = await StockModel.find({
      ingredientId: stock.ingredientId,
      status: Status.ACTIVE,
      _id: { $ne: id }, // Exclude the current stock
    });

    if (associatedStocks.length > 0) {
      // If there are other active stocks, allow deletion
      const deletedStock = await StockModel.findByIdAndUpdate(
        id,
        { status: Status.DELETED },
        { new: true }
      );
      return res.status(200).json({
        message: "Stock deleted successfully",
        deletedStock,
      });
    } else {
      // No other active stocks, check if the ingredient is still active
      const ingredient = await IngredientsModel.findById(stock.ingredientId);

      if (ingredient?.status === Status.ACTIVE) {
        // If the ingredient is active, block deletion
        return res.status(400).json({
          error:
            "Cannot delete this stock. This is the only stock for an active ingredient. Deactivate the ingredient first.",
        });
      } else {
        // If the ingredient is inactive, allow deletion
        const deletedStock = await StockModel.findByIdAndUpdate(
          id,
          { status: Status.DELETED },
          { new: true }
        );
        return res.status(200).json({
          message: "Stock deleted successfully",
          deletedStock,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete stock", details: error });
  }
};

export default {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock,
};
