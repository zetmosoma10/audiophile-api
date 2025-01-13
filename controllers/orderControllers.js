import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { CustomError } from "../utils/CustomError.js";
import { asyncErrorHandler } from "./../utils/asyncErrorHandler.js";

export const createOrder = asyncErrorHandler(async (req, res, next) => {
  const customer = req.customer;

  const cart = await Cart.findOne({ customer: customer._id });

  if (!cart || cart.products.length === 0) {
    return next(new CustomError("Cart is empty", 400));
  }

  const order = await Order.create({
    customer: customer._id,
    items: cart.products.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.quantity * item.price,
    })),
  });

  await Cart.findOneAndDelete({ customer: customer._id });

  res.status(201).send({
    success: true,
    order,
  });
});

export const getAllOrders = asyncErrorHandler(async (req, res) => {
  const customer = req.customer;

  const query = customer.isAdmin ? {} : { customer: customer._id };

  const orders = await Order.find(query)
    .populate("customer", "firstName lastName email")
    .populate("items.product", "name");

  res.status(200).send({
    success: true,
    count: orders.length,
    orders,
  });
});

export const getOrder = asyncErrorHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId)
    .populate("customer", "firstName lastName email")
    .populate("items.product", "name");

  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  res.status(200).send({
    success: true,
    order,
  });
});

export const updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];

  if (!validStatuses.includes(status)) {
    return next(new CustomError("Invalid status", 400));
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  );

  if (!updatedOrder) {
    return next(new CustomError("Order not found", 404));
  }

  res.status(200).send({
    success: true,
    order: updatedOrder,
  });
});

export const deleteOrder = asyncErrorHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findByIdAndDelete(orderId);

  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  res.status(200).send({
    success: true,
    message: "Order deleted successfully.",
  });
});
