import { Request, Response } from "express";
import mongoose from "mongoose";
import RecipeModel from "../../models/recipe/recipe.model";
import { Status } from "../../types/type";
import ProductModel from "../../models/products/products.model";

// Create a new recipe
export const createRecipe = async (req: Request, res: Response) => {
  const { name, ingredients } = req.body;
  const lastUpdatedBy = req.userId; // assuming userId is attached to the request

  try {
    const newRecipe = new RecipeModel({
      name,
      ingredients,
      lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get all recipes
export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await RecipeModel.find({
      status: { $ne: Status.DELETED },
    }).select("_id name");
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Get recipe by ID
export const getRecipeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const recipe = await RecipeModel.findById(id).populate(
      "ingredients.ingredientId"
    );
    if (!recipe || recipe.status === Status.DELETED) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Update a recipe
export const updateRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, ingredients } = req.body;
  const lastUpdatedBy = req.userId;

  try {
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      id,
      {
        name,
        ingredients,
        lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
      },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe || updatedRecipe.status === Status.DELETED) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// Soft delete a recipe (Change status to DELETED)
export const deleteRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if there are any products associated with this recipe
    const associatedProducts = await ProductModel.find({ recipeId: id });
    console.log(associatedProducts, ">>");

    if (associatedProducts.length > 0) {
      return res.status(400).json({
        error:
          "Cannot delete recipe. It is associated with one or more products.",
      });
    }

    // Soft delete the recipe by updating its status to DELETED

    const deletedRecipe = await RecipeModel.findByIdAndUpdate(
      id,
      { status: Status.DELETED }, // Set status to DELETED
      { new: true }
    );
    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};
