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
// get all drafted tarnsfer
exports.getAllDrafted = catchAsync(async (req, res, next) => {
  const allTransfers = await StockTransfer.find({ status: "draft" }).select(
    "-__v"
  );
  res.status(200).json({
    status: "success",
    results: allTransfers.length,
    data: {
      allTransfers,
    },
  });
});
// get all shipped stock transfer
exports.getAllShippedTransfer = catchAsync(async (req, res, next) => {
  const allShipped = await StockTransfer.find({ status: "shipping" }).select(
    "-__v"
  );
  res.status(200).json({
    statsu: "success",
    results: allShipped.length,
    data: {
      allShipped,
    },
  });
});
// get all transfered stock transfer
exports.getAllDelivered = catchAsync(async (req, res, next) => {
  const allDelivered = await StockTransfer.find({ status: "delivered" }).select(
    "-__v"
  );
  res.status(200).json({
    statsu: "success",
    results: allDelivered.length,
    data: {
      allDelivered,
    },
  });
});
// change status into shipped
exports.changeIntoShipped = catchAsync(async (req, res, next) => {
  const { transferId } = req.params;
  if (!transferId) return next(new AppError("provide transfer id", 500));
  const transfer = await StockTransfer.findById(transferId);
  if (!transfer)
    return next(new AppError("no transfer found with that id", 404));
  // reduce quantity from the stock and it's inventory
  for (let product of transfer.products) {
    const from = await Stock.findOne({
      productId: product.productId,
      inventoryId: transfer.from,
    });
    const inventoryFrom = await Inventory.findById(transfer.from);
    from.quantity -= product.unit;
    inventoryFrom.capacity += product.unit;
    await inventoryFrom.save({ validateBeforeSave: false });
    await from.save({ validateBeforeSave: false });
  }
  // add shipping cost into transfer action
  transfer.shippingCost = req.body.shippingCost;
  // change status from draft into shipped
  transfer.status = "shipping";
  await transfer.save({ validateBeforeSave: false });

  // create journal entry for stock transfer
  const jornal = await Jornal.findOne({ jornalType: "stock-transfer" });
  const accountExpense = await Account.findOne({ name: "expenses" });
  const accountBank = await Account.findOne({ name: "cash/bank" });
  await JornalEntry.create({
    jornalId: jornal._id,
    lines: [
      {
        accountId: accountExpense._id,
        description: `Records shipping cost ${transfer.shippingCost} for stock transfer`,
        debit: 0,
        credit: transfer.shippingCost,
      },
      {
        accountId: accountBank._id,
        description: `Tracks cash paid ${transfer.shippingCost} for stock transfer`,
        debit: transfer.shippingCost,
        credit: 0,
      },
    ],
  });
  transfer.status = "transferred";
  await transfer.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message:
      "transfer has been marked as “Shipping”, and the products have been deducted from the source warehouse",
  });
});

// change status into delivered
exports.changeStatusIntoDelivered = catchAsync(async (req, res, next) => {
  const { transferId } = req.params;
  if (transferId) return next(new AppError("provide transfer id", 500));
  const transfer = await StockTransfer.findById(transferId);
  if (!transfer)
    return next(new AppError("no stock transfer found with that id", 404));
  // increase stock at stock quantity and resuce the capacity of receiver inventory
  for (let product of transfer.products) {
    const to = await Stock.findOne({
      productId: product.productId,
      inventoryId: transfer.to,
    });
    to.quantity += product.unit;
    const inventoryTo = await Inventory.findById(transfer.to);
    inventoryTo.capacity -= product.unit;
    await inventoryTo.save({ validateBeforeSave: false });
    await to.save();
  }
  transfer.status = "delivered";
  await transfer.save({
    validateBeforeSave: false,
  });
  res.status(200).json({
    status: "success",
    message:
      "transfer has been marked as “Delivered”, and the products have been deducted to the destination warehouse.",
  });
});
// get the documnet for the trasnfered goods
exports.getDocument = catchAsync(async (req, res, next) => {
  const { transferId } = req.params;
  if (!transferId) return next(new AppError("provide transfer id", 500));
  const trasnfer = await StockTransfer.findById(transferId);
  if (!trasnfer)
    return next(new AppError("no stock transfer found with that id", 404));
  if (trasnfer.status !== "delivered")
    return next(
      new AppError(
        "transfer order is not delivered, mark it as delivered first to generate document",
        500
      )
    );
  res.status(200).json({
    status: "success",
    data: {
      trasnfer,
    },
  });
});
