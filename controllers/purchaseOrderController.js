const PurchaseOrder = require("./../models/purchaseOrderModel");
const Inventory = require("./../models/inventoryModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// create purchase order
exports.createPurchaseOrder = catchAsync(async (req, res, next) => {
  // check if the quantity of each product less than inventory's capacity
  const { products } = req.body;
  for (let product of products) {
    const inventory = await Inventory.findById(product.inventoryId);
    if (product.quantity > inventory.capacity)
      return next(
        new AppError("inventory can't accecpt this large quantity", 500)
      );
  }
  const purchaseOrder = await PurchaseOrder.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      purchaseOrder,
    },
  });
});
// update pruchase order
exports.updatePurchaseOrder = catchAsync(async (req, res, next) => {
  const { purchaseOrderId } = req.params;
  if (!purchaseOrderId)
    return next(new AppError("Purchase order id required", 500));
  const updatePurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
    purchaseOrderId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatePurchaseOrder)
    return next(new AppError("No purchase order found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatePurchaseOrder,
    },
  });
});
// delete a purchase order
exports.deletePurchaseOrder = catchAsync(async (req, res, next) => {
  const { purchaseOrderId } = req.params;
  if (!purchaseOrderId)
    return next(new AppError("Purchase order id required", 500));
  await PurchaseOrder.findByIdAndDelete(purchaseOrderId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
// get all purchases
exports.getAllPurchases = catchAsync(async (req, res, next) => {
  const purchases = await PurchaseOrder.find({});
  res.status(200).json({
    status: "success",
    length: purchases.length,
    data: {
      purchases,
    },
  });
});
// get purchase
exports.getpurchase = catchAsync(async (req, res, next) => {
  const purchase = await PurchaseOrder.findById(req.params.purchaseOrderId);
  res.status(200).json({
    status: "success",
    data: {
      purchase,
    },
  });
});
// get all drafted purchases
exports.getAllDraftedPurchases = catchAsync(async (req, res, next) => {
  const purchases = await PurchaseOrder.find({ status: "draft" });
  res.status(200).json({
    status: "success",
    results: purchases.length,
    data: {
      purchases,
    },
  });
});
// get all approved purchases
exports.getAllApprovedPurchases = catchAsync(async (req, res, next) => {
  const purchases = await PurchaseOrder.find({
    status: "approved",
  });
  res.status(200).json({
    status: "success",
    results: purchases.length,
    data: {
      purchases,
    },
  });
});
// get all delivered purchases
exports.getAllDeliveredPurchases = catchAsync(async (req, res, next) => {
  const purchases = await PurchaseOrder.find({
    status: "delivered",
  });
  res.status(200).json({
    status: "success",
    results: purchases.length,
    data: {
      purchases,
    },
  });
});

// update purchase order into approved
exports.updatePurchaseOrderIntoApproved = catchAsync(async (req, res, next) => {
  const { purchaseOrderId } = req.params;
  if (!purchaseOrderId)
    return next(new AppError("Purchase order id required", 500));
  const purchase = await PurchaseOrder.findById(purchaseOrderId);
  purchase.status = "approved";
  await purchase.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: {
      purchase,
    },
  });
});
// update purchsase order into delivered
exports.updatePurchaseOrderIntoDelivered = catchAsync(
  async (req, res, next) => {
    const { purchaseOrderId } = req.params;
    if (!purchaseOrderId)
      return next(new AppError("Purchase order id required", 500));
    const purchase = await PurchaseOrder.findById(purchaseOrderId);
    purchase.status = "delivered";
    await purchase.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      data: {
        purchase,
      },
    });
  }
);
