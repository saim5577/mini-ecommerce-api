const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const mongoose = require("mongoose");

exports.placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(400).json({ message: "Cart is empty" });

    const cartItems = await CartItem.find({ cartId: cart._id }).populate("productId");
    if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

    let totalAmount = 0;

    for (let item of cartItems) {
      if (item.quantity > item.productId.stock) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Not enough stock for ${item.productId.name}` });
      }
      totalAmount += item.quantity * item.productId.price;
    }

    const order = await Order.create([{ userId: req.user._id, totalAmount, status: "Pending" }], { session });

    for (let item of cartItems) {
      await OrderItem.create([{
        orderId: order[0]._id,
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      }], { session });

      item.productId.stock -= item.quantity;
      await item.productId.save({ session });
    }

    await CartItem.deleteMany({ cartId: cart._id }, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Order placed", order: order[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
