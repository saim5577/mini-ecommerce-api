const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem"); // ✅ must match file name exactly
const Product = require("../models/Product");


exports.addToCart = async (req, res) => {
     try {
    const { productId, quantity } = req.body;
    if (quantity <= 0) return res.status(400).json({ message: "Quantity must be > 0" });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (quantity > product.stock)
      return res.status(400).json({ message: "Quantity exceeds stock" });

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = await Cart.create({ userId: req.user._id });
    let cartItem = await CartItem.findOne({ cartId: cart._id, productId });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
   
    } 
    
    else {
      cartItem = await CartItem.create({
        cartId: cart._id,
        productId,
        quantity,
      });
    }

    res.json({ message: "Added to cart", cartItem });
  }
  
  catch (err) {
  console.error("Error in Controller:", err.message);
  res.status(500).json({ message: err.message });
}

};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.json({ items: [] });

    const items = await CartItem.find({ cartId: cart._id }).populate("productId");
    res.json({ items });
  } catch (err)
  {  console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
