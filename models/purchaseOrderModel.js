const mongoose = require("mongoose");
const purchaseOrderSchema = new mongoose.Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "Purchase order must be associated with a supplier"],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Purchase order must belong to an organization"],
      ref: "Organization",
    },
    invoiceNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required"],
        },
        name: {
          type: String,
          required: [true, "Name is required"],
          trim: true,
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required"],
          min: 1,
        },
        deliveredQuantity: Number,
        remainingQuantity: {
          type: Number,
          default: function () {
            return this.quantity;
          },
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
        },
        discount: {
          type: Number,
          default: 0,
        },
        total: Number,
        inventoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
        },
      },
    ],
    expectedDeliveryDate: {
      type: Date,
      required: [true, "Expected delivery date is required"],
    },
    currency: String,
    status: {
      type: String,
      enum: ["draft", "approved", "shipped", "delivered", "canceled"],
      default: "draft",
    },
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Purchase order must have a creator"],
    },
    totalAmount: Number,
  },
  { timestamps: true }
);
purchaseOrderSchema.pre("save", function (next) {
  if (this.isNew) {
    const randomNum = Math.floor(Math.random() * 600000);
    this.invoiceNumber = `INV-${randomNum}-000`;
  }
  this.products = this.products.map((item) => {
    item.total = item.quantity * item.price;
    item.total = item.total - (item.discount * item.total) / 100;
    return item;
  });
  this.totalAmount = this.products.reduce(
    (acc, current) => acc + current.total,
    0
  );
  next();
});
const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);
module.exports = PurchaseOrder;
