const express = require("express");
const saleInvoiceRouter = express();
const {
  createInvoice,
  getAllSaleOrderInvoice,
  getSaleOrderInvoice,
  deleteSaleOrderInvoice,
  updateSaleOrderInvoice,
} = require("./../controllers/saleInvoiceController");
saleInvoiceRouter.get("/", getAllSaleOrderInvoice);
saleInvoiceRouter.post("/:saleOrderId", createInvoice);
saleInvoiceRouter
  .route("/:saleOrderInvoiceId")
  .patch(updateSaleOrderInvoice)
  .get(getSaleOrderInvoice)
  .delete(deleteSaleOrderInvoice);
module.exports = saleInvoiceRouter;
