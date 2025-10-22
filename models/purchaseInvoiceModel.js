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
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: [true, "stock is required"],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    dueDate: Date,
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "product is required"],
        },
        quantity: {
          type: Number,
          required: [true, "quantity is required"],
          min: [0, "quantity can not be negative"],
        },
        price: {
          type: Number,
          required: [true, "price is required"],
          min: [0, "price can not be negative"],
        },
        totalPrice: Number,
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    totalAmount: Number,
    paidAmount: {
      type: Number,
      default: 0,
      min: [true, "paid amount can not be negative"],
    },
    remainingAmount: {
      type: Number,
      default: 0,
      min: [0, "remaining amount can not be negative"],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["paid", "unpaid", "partial"],
        message: "selected payment status is invalid",
      },
    },
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
PurchaseInvoice.pre("save", function (next) {
  this.products = this.products.map((item) => {
    item.totalPrice = item.quantity * item.price;
    item.totalPrice = item.totalPrice - (item.discount * item.totalPrice) / 100;
    return item;
  });
  this.totalAmount = this.products.reduce(
    (acc, current) => acc + current.totalPrice,
    0
  );
  const randomNum = Math.floor(Math.random() * 600000);
  this.invoiceNumber = `INV-${randomNum}-000`;
  next();
});

const PurchaseInvoice = mongoose.model(
  "PurchaseInvoice",
  purchaseInvoiceSchema
);
module.exports = PurchaseInvoice;
