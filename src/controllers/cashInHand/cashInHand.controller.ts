import { Request, Response } from "express";
import mongoose from "mongoose";
import ICashInHandModel from "../../models/cashInHand/cashInHand.model";
import { Status } from "../../utils/types/type";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";

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
    sendResponse(
      res,
      httpStatus.CREATED,
      "Item Recorded Successfully",
      savedCashInHand
    );
    return;
  } catch (error) {
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create cash entry"
    );
    return;
  }
};

// Get all cash entries (excluding deleted ones)
const getAllCashInHand = async (req: Request, res: Response) => {
  try {
    const cashEntries = await ICashInHandModel.find({
      status: { $ne: Status.DELETED },
    });
    sendResponse(res, httpStatus.OK, null, cashEntries);
    return;
  } catch (error) {
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch cash entries"
    );
    return;
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
      sendResponse(res, httpStatus.NOT_FOUND, "Cash entry not found");
      return;
    }

    res.status(200).json(cashInHand);
  } catch (error) {
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch cash entry"
    );
    return;
  }
};

// Update a cash entry
const updateCashInHand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const lastUpdatedBy = req.userId;
  const { cash } = req.body;

  try {
    const updatedCashInHand = await ICashInHandModel.findByIdAndUpdate(
      id,
      {
        cash: cash,
        lastUpdatedBy: new mongoose.Types.ObjectId(lastUpdatedBy),
      },
      { new: true, runValidators: true }
    );

    if (!updatedCashInHand) {
      sendResponse(res, httpStatus.NOT_FOUND, "Cash entry not found");
      return;
    }

    sendResponse(res, httpStatus.OK, null, updatedCashInHand);
    return;
  } catch (error) {
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update cash entry"
    );
    return;
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
      sendResponse(res, httpStatus.NOT_FOUND, "Cash entry not found");
      return;
    }
    sendResponse(
      res,
      httpStatus.OK,
      "Cash entry deleted successfully",
      deletedCashInHand
    );
    return;
  } catch (error) {
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete cash entry"
    );
    return;
  }
};

export default {
  createCashInHand,
  getAllCashInHand,
  getCashInHandById,
  updateCashInHand,
  deleteCashInHand,
};
