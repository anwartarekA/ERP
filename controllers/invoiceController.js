const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const PurchaseInvoice = require("./../models/purchaseInvoiceModel");
const PurchaseOrder = require("./../models/purchaseOrderModel");
const Product = require("../models/productModel");

//create purchase invoice
exports.createInvoice = catchAsync(async (req, res, next) => {
  const { purchaseOrderId } = req.params;
  if (!purchaseOrderId)
    return next(new AppError("provide purchase order id", 400));
  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
  if (!purchaseOrder)
    return next(
      new AppError("No purchase order with this id found on system", 404)
    );
  if (purchaseOrder.status != "delivered")
    return next(
      new AppError("can`t generate invoice for undelivered purchase order", 400)
    );

  const products = await Promise.all(
    purchaseOrder.products.map(async (product) => {
      const { code } = await Product.findById(product.productId);
      const tax = 0.14;
      const total =
        product.quantity * product.price +
        tax * (product.quantity * product.price);
      return {
        product: product.productId,
        code,
        deliveredQuantity: product.quantity,
        quantity: product.quantity,
        price: product.price,
        tax,
        total,
        inventory: product.inventoryId,
      };
    })
  );

  const totalPayment = products.reduce((acc, cur) => acc + cur.total, 0);

  const invoice = await PurchaseInvoice.create({
    invoiceNumber: purchaseOrder.invoiceNumber,
    pruchaseOrder: purchaseOrderId,
    supplier: purchaseOrder.supplierId,
    organization: purchaseOrder.organizationId,
    products,
    notes: req.body.notes,
    totalPayment,
  });
  res.status(201).json({
    status: "success",
    data: {
      invoice,
    },
  });
});
exports.getAllPurchaseInvoices = catchAsync(async (req, res, next) => {
  const purchaseInvoices = await PurchaseInvoice.find();
  res.status(200).json({
    status: "success",
    results: purchaseInvoices.length,
    data: {
      purchaseInvoices,
    },
  });
});
// get a single purchase invoice
exports.getPurchaseInvoice = catchAsync(async (req, res, next) => {
  const { purchaseInvoiceId } = req.params;
  if (!purchaseInvoiceId)
    return next(new AppError("provide purchase invoice id", 500));
  const purchaseInvoice = await PurchaseInvoice.findById(purchaseInvoiceId);
  if (!purchaseInvoice)
    return next(new AppError("no invoice found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      purchaseInvoice,
    },
  });
});
//update invoice
exports.updatePurchaseInvoice = catchAsync(async (req, res, next) => {
  const { purchaseInvoiceId } = req.params;
  if (!purchaseInvoiceId)
    return next(new AppError("provide purchase invoice id", 500));

  const updatedPurchaseInvoice = await PurchaseInvoice.findByIdAndUpdate(
    purchaseInvoiceId,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedPurchaseInvoice)
    return next(new AppError("no invoice found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatedPurchaseInvoice,
    },
  });
});
//delete purchase invoice
exports.deletePurchaseInvoice = catchAsync(async (req, res, next) => {
  const { purchaseInvoiceId } = req.params;
  if (!purchaseInvoiceId)
    return next(new AppError("provide purchase invoice id", 500));
  await PurchaseInvoice.findByIdAndDelete(purchaseInvoiceId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
