const express = require("express");
const router = express.Router();
const { createProduct, getProducts } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.get("/", getProducts);
router.post("/", authMiddleware, roleMiddleware(["ADMIN"]), createProduct);

module.exports = router;
