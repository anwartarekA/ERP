const express = require("express");
const {
  createInventory,
  getAllInventories,
  getInventory,
  updateInventory,
  deleteInventory,
} = require("./../controllers/inventoryController.js");
const {
  addStockToInventory,
  getStock,
  getStocks,
} = require("./../controllers/stockController.js");
const inventoryRouter = express.Router();

inventoryRouter.route("/").post(createInventory).get(getAllInventories);

inventoryRouter
  .route("/:inventoryId")
  .get(getInventory)
  .patch(updateInventory)
  .delete(deleteInventory);
inventoryRouter.get("/:inventoryId/stocks/:stockId", getStock);
inventoryRouter.get("/:inventoryId/stocks/", getStocks);
inventoryRouter.post("/:inventoryId/stock/", addStockToInventory);

module.exports = inventoryRouter;
