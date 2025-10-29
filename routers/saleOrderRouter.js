const express = require("express");
const {
  createSaleOrder,
  getAllSaleOrders,
  getSaleOrder,
  updateSaleOrder,
  deleteSaleOrder,
  getAlldraftedSaleOrder,
  updateSaleOrderIntoApproved,
  getAllApprovedSaleOrder,
  getAllDeliveredSaleOrder,
} = require("./../controllers/saleOrderController");
const { stockOut } = require("./../controllers/stockController");
const saleOrderRouter = express.Router();
saleOrderRouter.route("/").post(createSaleOrder).get(getAllSaleOrders);
saleOrderRouter.get("/status=draft", getAlldraftedSaleOrder);
saleOrderRouter.get("/status=approved", getAllApprovedSaleOrder);
saleOrderRouter.get("/status=delivered", getAllDeliveredSaleOrder);
saleOrderRouter
  .route("/:saleOrderId")
  .get(getSaleOrder)
  .patch(updateSaleOrder)
  .delete(deleteSaleOrder);
saleOrderRouter.patch("/:saleOrderId/approve", updateSaleOrderIntoApproved);
saleOrderRouter.get("/:saleOrderId/status=delivered", stockOut);
module.exports = saleOrderRouter;
