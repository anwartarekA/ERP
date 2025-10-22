const express = require("express");
const {
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getAllPurchases,
  getpurchase,
  getAllDraftedPurchases,
  getAllApprovedPurchases,
  getAllDeliveredPurchases,
  updatePurchaseOrderIntoApproved,
  updatePurchaseOrderIntoDelivered,
} = require("../controllers/purchaseOrderController");
const { stockIn } = require("./../controllers/stockController");
const router = express.Router();
router.route("/").post(createPurchaseOrder).get(getAllPurchases);
router.get("/status=draft", getAllDraftedPurchases);
router.get("/status=approved", getAllApprovedPurchases);
router.get("/status=delivered", getAllDeliveredPurchases);

router
  .route("/:purchaseOrderId")
  .get(getpurchase)
  .patch(updatePurchaseOrder)
  .delete(deletePurchaseOrder);
router.patch("/:purchaseOrderId/approve", updatePurchaseOrderIntoApproved);
router.patch("/:purchaseOrderId/deliver", updatePurchaseOrderIntoDelivered);
router.get("/:purchaseOrderId/delivered", stockIn);
module.exports = router;
