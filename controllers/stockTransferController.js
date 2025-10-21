const StockTransfer = require("./../models/stockTransferModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Stock = require("./../models/stockModel");
const Inventory = require("../models/inventoryModel");
const JornalEntry = require("../models/jornalEntryModel");
const Jornal = require("../models/jornalModel");
const account = require("../models/accountingModel");
const Account = require("../models/accountingModel");
// create stock transfer
exports.createStockTransfer = catchAsync(async (req, res, next) => {
  const stockTransfer = await StockTransfer.create(req.body);
  // 1- GET the transferer inventory and decrease the quantity
  //     from.quantity -=
  for (let product of stockTransfer.products) {
    const from = await Stock.findOne({
      productId: product.productId,
      inventoryId: stockTransfer.from,
    });
    const inventoryFrom = await Inventory.findById(stockTransfer.from);

    from.quantity -= product.unit;
    inventoryFrom.capacity += product.unit;
    await inventoryFrom.save({ validateBeforeSave: false });
    await from.save();
    const to = await Stock.findOne({
      productId: product.productId,
      inventoryId: stockTransfer.to,
    });
    to.quantity += product.unit;
    const inventoryTo = await Inventory.findById(stockTransfer.to);
    inventoryTo.capacity -= product.unit;
    await inventoryTo.save({ validateBeforeSave: false });
    await to.save();
  }
  // create journal entry for stock transfer
  const jornal = await Jornal.findOne({ jornalType: "stock-transfer" });
  const accountExpense = await Account.findOne({ name: "expenses" });
  const accountBank = await Account.findOne({ name: "cash/bank" });
  await JornalEntry.create({
    jornalId: jornal._id,
    lines: [
      {
        accountId: accountExpense._id,
        description: `Records shipping cost ${stockTransfer.shippingCost} for stock transfer`,
        debit: 0,
        credit: stockTransfer.shippingCost,
      },
      {
        accountId: accountBank._id,
        description: `Tracks cash paid ${stockTransfer.shippingCost} for stock transfer`,
        debit: stockTransfer.shippingCost,
        credit: 0,
      },
    ],
  });
  stockTransfer.status = "transferred";
  await stockTransfer.save({ validateBeforeSave: false });
  // 3- create stock transfer
  res.status(201).json({
    status: "success",
    data: {
      stockTransfer,
    },
  });
});
//get all stock transfers
exports.getAllStockTransfer = catchAsync(async (req, res, next) => {
  const stockTransfers = await StockTransfer.find().select("-__V");
  res.status(200).json({
    status: "success",
    results: stockTransfers.length,
    data: {
      stockTransfers,
    },
  });
});
// update stock transfer
exports.updateStockTransfer = catchAsync(async (req, res, next) => {
  const { stockTransferId } = req.params;
  if (!stockTransferId) return next(new AppError("Please provide id", 500));
  const updatedStockTransfer = await StockTransfer.findByIdAndUpdate(
    stockTransferId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedStockTransfer)
    return next(new AppError("No stock transfer found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatedStockTransfer,
    },
  });
});
