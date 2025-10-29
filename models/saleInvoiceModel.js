const mongoose = require("mongoose");
const saleInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: String,
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "customer is required"],
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    saleOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SaleOrder",
      required: [true, "sale order is required"],
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
        code: Number,
        quantity: Number,
        price: {
          type: Number,
          required: [true, "price is required"],
          min: [0, "price can not be negative"],
        },
        total: Number,
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

const SaleInvoice = mongoose.model("SaleInvoice", saleInvoiceSchema);
module.exports = SaleInvoice;
