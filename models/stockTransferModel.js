const mongoose = require("mongoose");
const Product = require("./../models/productModel");
const stockTransferSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: [true, "select the status"],
      enum: {
        values: ["draft", "shipping", "delivered"],
        message: "{VALUE} is not supported",
      },
    },
    reference: {
      type: String,
      unique: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: [true, "select an inventory to transfer from"],
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: [true, "select an inventory to receive products"],
    },
    products: Array,
    shippingCost: Number,
  },
  {
    timestamps: true,
  }
);
// stockTransferSchema.pre("save", async function (next) {
//   const totalArray = await Promise.all(
//     this.products.map(
//       async (product) =>
//         await Product.findById(product.productId).select("-_id total")
//     )
//   );
//   const amount = totalArray.reduce((acc, current) => acc + current.total, 0);
//   this.total = amount + this.shippingCost;
//   next();
// });
const StockTransfer = mongoose.model("StockTransfer", stockTransferSchema);
module.exports = StockTransfer;
