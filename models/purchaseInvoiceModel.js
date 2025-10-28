const mongoose = require("mongoose");
const Product = require("./productModel");
const purchaseInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: String,
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "supplier is required"],
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    pruchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      required: [true, "purchase order is required"],
    },
    dueDate: Date,
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "product is required"],
        },
        inventory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
          required: [true, "inventory is required"],
        },
        code: String,
        quantity: Number,
        deliveredQuantity: {
          type: Number,
          required: [true, "quantity is required"],
          min: [0, "quantity can not be negative"],
        },
        price: {
          type: Number,
          required: [true, "price is required"],
          min: [0, "price can not be negative"],
        },
        total: Number,
        tax: Number,
      },
    ],
    totalPayment: Number,
    paymentStatus: {
      type: String,
      enum: {
        values: ["paid", "unpaid", "partial"],
        message: "selected payment status is invalid",
      },
      default: "unpaid",
    },
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const PurchaseInvoice = mongoose.model(
  "PurchaseInvoice",
  purchaseInvoiceSchema
);
module.exports = PurchaseInvoice;
