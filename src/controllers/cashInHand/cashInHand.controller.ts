import { Request, Response } from "express";
import mongoose from "mongoose";
import ICashInHandModel from "../../models/cashInHand/cashInHand.model";
import { Status } from "../../types/type";

// Create a new cash entry
const createCashInHand = async (req: Request, res: Response) => {
  const { cash } = req.body;
  const lastUpdatedBy = req.userId;

  try {
    const cashInHand = new ICashInHandModel({
      cash,
      lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
    });

    const savedCashInHand = await cashInHand.save();
    res.status(201).json(savedCashInHand);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create cash entry", details: error });
  }
};

// Get all cash entries (excluding deleted ones)
const getAllCashInHand = async (req: Request, res: Response) => {
  try {
    const cashEntries = await ICashInHandModel.find({
      status: { $ne: Status.DELETED },
    });
    res.status(200).json(cashEntries);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch cash entries", details: error });
  }
};

// Get cash entry by ID
const getCashInHandById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cashInHand = await ICashInHandModel.findOne({
      _id: id,
      status: { $ne: Status.DELETED },
    });

    if (!cashInHand) {
      return res.status(404).json({ error: "Cash entry not found" });
    }

    res.status(200).json(cashInHand);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch cash entry", details: error });
  }
};

// Update a cash entry
const updateCashInHand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const lastUpdatedBy = req.userId;
  const cash = req.body;

  try {
    const updatedCashInHand = await ICashInHandModel.findByIdAndUpdate(
      id,
      {
        cash,
        lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
      },
      { new: true, runValidators: true }
    );

    if (!updatedCashInHand) {
      return res.status(404).json({ error: "Cash entry not found" });
    }

    res.status(200).json(updatedCashInHand);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update cash entry", details: error });
  }
};

// Soft delete a cash entry (Change status to DELETED)
const deleteCashInHand = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCashInHand = await ICashInHandModel.findByIdAndUpdate(
      id,
      { status: Status.DELETED },
      { new: true }
    );

    if (!deletedCashInHand) {
      return res.status(404).json({ error: "Cash entry not found" });
    }

    res
      .status(200)
      .json({ message: "Cash entry deleted successfully", deletedCashInHand });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete cash entry", details: error });
  }
};

export default {
  createCashInHand,
  getAllCashInHand,
  getCashInHandById,
  updateCashInHand,
  deleteCashInHand,
};
