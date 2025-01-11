import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { CustomError } from "../utils/CustomError.js";
import { asyncErrorHandler } from "./../utils/asyncErrorHandler.js";

export const createOrder = asyncErrorHandler(async (req, res, next) => {
  const customer = req.customer;

  const { items } = req.body;

  if (!items || items.length === 0) {
    return next(new CustomError("items should have at least one product", 400));
  }

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(
        new CustomError(`Product with ID: ${item.product} not found.`, 404)
      );
    }
    item.price = product.price;
  }

  const order = await Order.create({
    customer: customer._id,
    items,
  });

  res.status(201).send({
    success: true,
    order,
  });
});

export const getAllOrders = asyncErrorHandler(async (req, res) => {
  const customer = req.customer;

  const id = customer.isAdmin ? "" : customer._id;

  const orders = await Order.find({ customer: id })
    .populate("customer", "name email")
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
    .populate("customer", "name email")
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
