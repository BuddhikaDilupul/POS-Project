import { Request, Response } from "express";
import mongoose from "mongoose";
import OrderModel from "../../models/order/order.model";
import ProductModel from "../../models/products/products.model";
import StockModel from "../../models/stocks/stocks.model";
import ProductAddonModel from "../../models/products/productsaddons.model";
import SubProductModel from "../../models/products/subProducts.model";
import { IRecipe } from "../../models/recipe/recipe.model";

async function calculateProfitWithinDateRange(req: Request, res: Response) {
  const { startDate, endDate } = req.body;

  try {
    // Find all orders within the date range
    const orders = await OrderModel.find({
      orderedDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate([
      { path: "orderedProducts.productId" },
      { path: "orderedAddons.addonId" },
      { path: "orderedSubProducts.subProductId" },
    ]);

    const productProfit = [];
    const productAddonProfit = [];
    const subProductProfit = [];

    for (const order of orders) {
      // Product Profit Calculation
      for (const orderedProduct of order.orderedProducts) {
        const product = await ProductModel.findById(
          orderedProduct.productId
        ).populate("recipeId");

        if (!product) continue;

        const recipe = product.recipeId as IRecipe;

        let totalCost = 0;

        // Check if recipeId is populated with ingredients
        if (recipe?.ingredients) {
          for (const ingredient of recipe.ingredients) {
            const stock = await StockModel.findOne({
              ingredientId: ingredient.ingredientId,
            });

            if (stock) {
              const ingredientCost = ingredient.quantity * stock.unitPrice;
              totalCost += ingredientCost;
            }
          }
        }

        const income = product.sellingPrice * orderedProduct.quantity;

        productProfit.push({
          productName: product.description,
          income: income.toFixed(2),
          cost: totalCost.toFixed(2),
        });
      }

      // Addon Profit Calculation
      for (const orderedAddon of order.orderedAddons) {
        const addon = await ProductAddonModel.findById(orderedAddon.addonId);
        if (addon) {
          const stock = await StockModel.findById(addon.stockId);
          if (stock) {
            const totalCost = stock.unitPrice * addon.sellingQuantity;
            const income = addon.sellingPrice * orderedAddon.quantity;

            productAddonProfit.push({
              addonName: addon.ingredientsId,
              income: income.toFixed(2),
              cost: totalCost.toFixed(2),
            });
          }
        }
      }

      // SubProduct Profit Calculation
      for (const orderedSubProduct of order.orderedSubProducts) {
        const subProduct = await SubProductModel.findById(
          orderedSubProduct.subProductId
        );

        if (subProduct) {
          const income = subProduct.sellingPrice * orderedSubProduct.quantity;
          const cost = subProduct.purchasedCost * orderedSubProduct.quantity;

          subProductProfit.push({
            name: subProduct.name,
            income: income.toFixed(2),
            cost: cost.toFixed(2),
          });
        }
      }
    }

    return res.status(200).json({
      productProfit,
      productAddonProfit,
      subProductProfit,
    });
  } catch (error) {
    console.error("Error calculating profit:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while calculating profit." });
  }
}

export default calculateProfitWithinDateRange;
