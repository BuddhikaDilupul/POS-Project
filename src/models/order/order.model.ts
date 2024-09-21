import mongoose, { Document, Schema } from "mongoose";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../../types/type";

// Define the interface for an order
export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  discounts?: number;
  cashierId: mongoose.Types.ObjectId;
  orderedProducts: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  orderedAddons: {
    addonId: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  orderedSubProducts: {
    subProductId: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderedDate: Date;
}

// Create the order schema
const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, ref: "Customers" },
    discounts: { type: Number, default: 0 },
    cashierId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    orderedProducts: [
      {
        productId: { type: Schema.Types.ObjectId, required: true, ref: "Products" },
        quantity: { type: Number, required: true },
      },
    ],
    orderedAddons: [
      {
        addonId: { type: Schema.Types.ObjectId, required: true, ref: "ProductAddons" },
        quantity: { type: Number, required: true },
      },
    ],
    orderedSubProducts: [
      {
        subProductId: { type: Schema.Types.ObjectId, required: true, ref: "SubProducts" },
        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    orderStatus: { type: String, enum: Object.values(OrderStatus), required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), required: true },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
    orderedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "lastUpdatedAt" },
  }
);

// Create the order model
const OrderModel = mongoose.model<IOrder>("Orders", OrderSchema);

export default OrderModel;
