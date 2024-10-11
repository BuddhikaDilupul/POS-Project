import { Request, Response } from "express";
import mongoose from "mongoose";
import OrderModel from "../../models/order/order.model";
import { OrderStatus, PaymentStatus } from "../../utils/types/type";

// Create a new order
const createOrder = async (req: Request, res: Response) => {
  const {
    customerId,
    cashierId,
    orderedProducts,
    orderedAddons,
    orderedSubProducts,
    totalAmount,
    paymentMethod,
  } = req.body;
  
  try {
    const newOrder = new OrderModel({
      customerId: new mongoose.Types.ObjectId(customerId),
      cashierId: new mongoose.Types.ObjectId(cashierId),
      orderedProducts,
      orderedAddons,
      orderedSubProducts,
      totalAmount,
      orderStatus: OrderStatus.PLACED, // Initial status set to PLACED
      paymentStatus: PaymentStatus.SUCCESS, // Payment status set to PAID (SUCCESS)
      paymentMethod,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order", details: error });
  }
};

// Get all orders
const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find()
      .populate("customerId")
      .populate("cashierId")
      .populate("orderedProducts.productId")
      .populate("orderedAddons.addonId")
      .populate("orderedSubProducts.subProductId");
      
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders", details: error });
  }
};

// Get order by ID
const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const order = await OrderModel.findById(id)
      .populate("customerId")
      .populate("cashierId")
      .populate("orderedProducts.productId")
      .populate("orderedAddons.addonId")
      .populate("orderedSubProducts.subProductId");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order", details: error });
  }
};

// Update order status to PROCESSING
const updateOrderToProcessing = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { orderStatus: OrderStatus.PROCESSING },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order to processing", details: error });
  }
};

// Update order status to DELIVERED
const updateOrderToDelivered = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { orderStatus: OrderStatus.DELIVERED },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order to delivered", details: error });
  }
};

// Cancel an order (Only if status is PLACED)
const cancelOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.orderStatus !== OrderStatus.PLACED) {
      return res.status(400).json({ error: "Only orders with status 'PLACED' can be canceled." });
    }

    order.orderStatus = OrderStatus.CANCELED;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel order", details: error });
  }
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderToProcessing,
  updateOrderToDelivered,
  cancelOrder,
};
