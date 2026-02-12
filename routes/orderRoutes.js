const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrders } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/place", authMiddleware, roleMiddleware(["CUSTOMER"]), placeOrder);
router.get("/my-orders", authMiddleware, roleMiddleware(["CUSTOMER"]), getMyOrders);

module.exports = router;
