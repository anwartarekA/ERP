const SaleInvoice = require("./../models/saleInvoiceModel.js");
const SaleOrder = require("./../models/saleOrderModel.js");
const catchAsync = require("./../utils/catchAsync.js");
const AppError = require("./../utils/appError.js");
const Product = require("./../models/productModel.js");
exports.createInvoice = catchAsync(async (req, res, next) => {
  const { saleOrderId } = req.params;
  if (!saleOrderId) return next(new AppError("provide sale order id", 500));
  const saleOrder = await SaleOrder.findById(saleOrderId);
  if (!saleOrder)
    return next(new AppError("there is no sale order with that id", 404));

  const products = await Promise.all(
    saleOrder.products.map(async (product) => {
      const { code } = await Product.findById(product.productId);

      return {
        product: product.productId,
        code,
        quantity: product.quantity,
        price: product.price,
        discount: product.discount,
        tax: product.tax,
        total: product.total,
        inventory: product.inventoryId,
      };
    })
  );
  const invoice = await SaleInvoice.create({
    invoiceNumber: saleOrder.invoiceNumber,
    customer: saleOrder.customerId,
    organization: saleOrder.organizationId,
    products,
    saleOrder: saleOrderId,
    notes: req.body.notes,
    createdBy: saleOrder.createdBy,
    tax: saleOrder.tax,
    totalPayment: saleOrder.totalAmount,
  });
  res.status(201).json({
    status: "success",
    data: {
      invoice,
    },
  });
});
// get all sale order invoice
exports.getAllSaleOrderInvoice = catchAsync(async (req, res, next) => {
  const saleorderInvoices = await SaleInvoice.find().select("-__v");
  res.status(200).json({
    status: "success",
    results: saleorderInvoices.length,
    data: {
      saleorderInvoices,
    },
  });
});
// get a sale order invoice
exports.getSaleOrderInvoice = catchAsync(async (req, res, next) => {
  const { saleOrderInvoiceId } = req.params;
  if (!saleOrderInvoiceId)
    return next(new AppError("provide sale order id", 500));
  const invoice = await SaleInvoice.findById(saleOrderInvoiceId);
  if (!invoice) return next(new AppError("no invoice found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      invoice,
    },
  });
});
// update a sale order invoice
exports.updateSaleOrderInvoice = catchAsync(async (req, res, next) => {
  const { saleOrderInvoiceId } = req.params;
  if (!saleOrderInvoiceId)
    return next(new AppError("provide sale order id", 500));
  const updatedSaleOrderInvoice = await SaleInvoice.findByIdAndUpdate(
    saleOrderInvoiceId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedSaleOrderInvoice)
    return next(new AppError("no invoice found with that id", 404));
  res.status(200).json({
    status: "success",
    data: updatedSaleOrderInvoice,
  });
});
// delete a sale order invoice
exports.deleteSaleOrderInvoice = catchAsync(async (req, res, next) => {
  const { saleOrderInvoiceId } = req.params;
  if (!saleOrderInvoiceId)
    return next(new AppError("provide sale order invoice id", 500));
  await SaleInvoice.findByIdAndDelete(saleOrderInvoiceId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
