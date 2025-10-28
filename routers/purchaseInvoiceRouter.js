const express = require("express");
const purchaseInvoiceRouter = express.Router();
const {
  getAllPurchaseInvoices,
  createInvoice,
  getPurchaseInvoice,
  updatePurchaseInvoice,
  deletePurchaseInvoice,
} = require("./../controllers/invoiceController");
purchaseInvoiceRouter.route("/").get(getAllPurchaseInvoices);
purchaseInvoiceRouter.post("/:purchaseOrderId", createInvoice);
purchaseInvoiceRouter
  .route("/:purchaseInvoiceId")
  .get(getPurchaseInvoice)
  .patch(updatePurchaseInvoice)
  .delete(deletePurchaseInvoice);
module.exports = purchaseInvoiceRouter;
