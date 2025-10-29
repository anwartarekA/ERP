const { default: mongoose } = require("mongoose");
const mongooose = require("mongoose");
const saleOrderSchema = new mongooose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "select customer"],
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "sale order must belong to an organization"],
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
        price: {
          type: Number,
          required: [true, "Product price is required"],
        },
        discount: Number,
        code: Number,
        total: {
          type: Number,
        },
        inventoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
        },
      },
    ],
    tax: Number,
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
      required: [true, "sale order must have a creator"],
    },
    shippingCost: Number,
    totalAmount: Number,
  },
  { timestamps: true }
);

saleOrderSchema.pre("save", function (next) {
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
  this.totalAmount += (this.tax * this.totalAmount) / 100;
  this.totalAmount += this.shippingCost;
  next();
});
const SaleOrder = mongoose.model("SaleOrder", saleOrderSchema);
module.exports = SaleOrder;
