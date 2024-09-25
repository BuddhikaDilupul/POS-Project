import { Request, Response } from "express";
import mongoose from "mongoose";
import IngredientsModel from "../../models/ingredients/ingredients.model";
import { Status } from "../../types/type";

// Create a new ingredient
export const createIngredient = async (req: Request, res: Response) => {
  const { name, unit } = req.body;
  const lastUpdatedBy = req.userId; // assuming userId is attached to the request

  try {
    const newIngredient = new IngredientsModel({
      name,
      unit,
      lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
    });

    const savedIngredient = await newIngredient.save();
    res.status(201).json(savedIngredient);
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get all ingredients
export const getAllIngredients = async (req: Request, res: Response) => {
  try {
    const ingredients = await IngredientsModel.find({
      status: { $ne: Status.DELETED },
    }).select(
      "_id name"
    );;
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get ingredient by ID
export const getIngredientById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ingredient = await IngredientsModel.findById(id);
    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Update an ingredient
export const updateIngredient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, unit } = req.body;
  const lastUpdatedBy = req.userId;

  try {
    const updatedIngredient = await IngredientsModel.findByIdAndUpdate(
      id,
      {
        name,
        unit,
        lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
      },
      { new: true, runValidators: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    res.status(200).json(updatedIngredient);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Delete an ingredient (Soft Delete by updating status to DELETED)
export const deleteIngredient = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedIngredient = await IngredientsModel.findByIdAndUpdate(
      id,
      { status: "DELETED" },
      { new: true }
    );
    if (!deletedIngredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    res.status(200).json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};
