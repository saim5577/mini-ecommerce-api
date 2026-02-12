const express = require("express");
const router = express.Router();
const { addToCart, getCart } = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.post("/add", authMiddleware, roleMiddleware(["CUSTOMER"]), addToCart);
router.get("/", authMiddleware, roleMiddleware(["CUSTOMER"]), getCart);

module.exports = router;
