const SaleOrder = require("./../models/saleOrderModel");
const Inventory = require("./../models/inventoryModel");
const Stock = require("./../models/stockModel");
const Jornal = require("./../models/jornalModel");
const JornalEntry = require("./../models/jornalEntryModel");
const Account = require("./../models/accountingModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// create sale order
exports.createSaleOrder = catchAsync(async (req, res, next) => {
  const { products } = req.body;
  for (let product of products) {
    const stock = await Stock.findOne({
      productId: product.productId,
      inventoryId: product.inventoryId,
    });
    if (product.quantity > stock.quantity)
      return next(
        new AppError("our stock is not enough to sale this amount", 500)
      );
  }
  const saleOrder = await SaleOrder.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      saleOrder,
    },
  });
});
// get all sale orders
exports.getAllSaleOrders = catchAsync(async (req, res, next) => {
  const saleOrders = await SaleOrder.find();
  res.status(200).json({
    status: "success",
    results: saleOrders.length,
    data: {
      saleOrders,
    },
  });
});
// get a sale order
exports.getSaleOrder = catchAsync(async (req, res, next) => {
  const { saleOrderId } = req.params;
  if (!saleOrderId) return next(new AppError("sale order id is required", 500));
  const saleOrder = await SaleOrder.findById(saleOrderId);
  if (!saleOrder)
    return next(new AppError("no sale order found with that id", 404));
  res.status(200).json({
    status: "success",
    data: { saleOrder },
  });
});
// update sale order
exports.updateSaleOrder = catchAsync(async (req, res, next) => {
  const { saleOrderId } = req.params;
  if (!saleOrderId) return next(new AppError("sale order id is required", 500));
  const updateSaleOrder = await SaleOrder.findByIdAndUpdate(
    saleOrderId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateSaleOrder)
    return next(new AppError("no sale order found with that id", 404));
  res.status(200).json({
    status: "success",
    data: { updateSaleOrder },
  });
});
//delete sale order
exports.deleteSaleOrder = catchAsync(async (req, res, next) => {
  const { saleOrderId } = req.params;
  if (!saleOrderId) return next(new AppError("sale order id is required", 500));
  await SaleOrder.findByIdAndDelete(saleOrderId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
// get all drafted sale order
exports.getAlldraftedSaleOrder = catchAsync(async (req, res, next) => {
  const saleOrders = await SaleOrder.find({ status: "draft" }).select("-_v");
  res.status(200).json({
    status: "success",
    results: saleOrders.length,
    data: {
      saleOrders,
    },
  });
});
// update sale order into approved
exports.updateSaleOrderIntoApproved = catchAsync(async (req, res, next) => {
  const { saleOrderId } = req.params;
  if (!saleOrderId) return next(new AppError("provide sale order id", 500));
  await SaleOrder.findByIdAndUpdate(
    saleOrderId,
    {
      status: "approved",
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "sale order became approved",
  });
});
// get all approved sale order
exports.getAllApprovedSaleOrder = catchAsync(async (req, res, next) => {
  const saleOrders = await SaleOrder.find({ status: "approved" }).select("-_v");
  res.status(200).json({
    status: "success",
    results: saleOrders.length,
    data: {
      saleOrders,
    },
  });
});
// get all delivered sale order
exports.getAllDeliveredSaleOrder = catchAsync(async (req, res, next) => {
  const saleOrder = await SaleOrder.find({ status: "delivered" }).select("-_v");
  res.status(200).json({
    status: "success",
    results: saleOrder.length,
    data: {
      saleOrder,
    },
  });
});
