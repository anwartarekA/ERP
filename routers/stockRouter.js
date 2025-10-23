const express = require("express");
const stockRouter = express.Router();
const {
  updateStock,
  deleteStock,
  getAllStocks,
} = require("./../controllers/stockController.js");
stockRouter.get("/", getAllStocks);
stockRouter.route("/:stockId").patch(updateStock).delete(deleteStock);
module.exports = stockRouter;
