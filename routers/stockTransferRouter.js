const express = require("express");
const stockTransferRouter = express.Router();
const {
  createStockTransfer,
  getAllStockTransfer,
  updateStockTransfer,
  getAllDrafted,
  getAllShippedTransfer,
  getAllDelivered,
  changeIntoShipped,
  changeStatusIntoDelivered,
  getDocument,
} = require("./../controllers/stockTransferController");
stockTransferRouter
  .route("/")
  .post(createStockTransfer)
  .get(getAllStockTransfer);
stockTransferRouter.get("/status=draft", getAllDrafted);
stockTransferRouter.patch("/:transferId/shipping", changeIntoShipped);
stockTransferRouter.get("/status=shipped", getAllShippedTransfer);
stockTransferRouter.patch("/:trasnferId/delivered", changeStatusIntoDelivered);
stockTransferRouter.get("/status=delivered", getAllDelivered);
stockTransferRouter.get("/status=delivered/transferId", getDocument);

stockTransferRouter.patch("/:stockTransferId", updateStockTransfer);
module.exports = stockTransferRouter;
