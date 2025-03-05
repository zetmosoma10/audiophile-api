import _ from "lodash";
import { Cart } from "../models/Cart.js";
import { Order, validateOrder } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { CustomError } from "../utils/CustomError.js";
import { asyncErrorHandler } from "./../utils/asyncErrorHandler.js";
import { sendEmail } from "../emails/email.js";
import { orderCreatedEmail } from "../emails/orderCreatedEmail.js";
import { orderStatusUpdatedEmail } from "../emails/orderStatusUpdatedEmail.js";

export const createOrder = asyncErrorHandler(async (req, res, next) => {
  const customer = req.customer;

  const err = validateOrder(req.body);
  if (err) {
    return next(new CustomError(err, 400));
  }

  const {
    name,
    email,
    phone,
    address,
    city,
    postalCode,
    country,
    paymentMethod,
    eMoneyNumber,
    eMoneyPin,
  } = req.body;

  const cart = await Cart.findOne({ customer: customer._id });

  if (!cart || cart.products.length === 0) {
    return next(new CustomError("Cart is empty", 400));
  }

  const trackStock = [];

  const updateStockPromises = cart.products.map(async (item) => {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    if (product.stock < item.quantity) {
      throw new CustomError(`${product.name} is out of stock`, 400);
    }

    trackStock.push({
      productId: product._id,
      restoreQuantity: product.stock,
    });

    product.stock -= item.quantity;
    await product.save();
  });

  try {
    await Promise.all(updateStockPromises);
  } catch (err) {
    return next(err);
  }

  const order = await Order.create({
    customer: customer._id,
    name,
    email,
    phone,
    address,
    city,
    postalCode,
    country,
    paymentMethod,
    eMoneyNumber,
    eMoneyPin,
    items: cart.products.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      normalPrice: item.normalPrice,
      finalPrice: item.finalPrice,
      totalNormalPrice: item.quantity * item.normalPrice,
      totalFinalPrice: item.quantity * item.finalPrice,
    })),
    normalTotal: cart.normalTotal,
    finalTotal: cart.finalTotal,
    grandTotal: cart.grandTotal,
  });

  // * Restore stock if order creation fails
  if (!order) {
    try {
      const restoreStockPromises = trackStock.map(async (item) => {
        const product = await Product.findById(item.productId);
        product.stock = item.restoreQuantity;
        await product.save();
      });

      await Promise.all(restoreStockPromises);
    } catch (error) {
      console.log("Error restoring stock: ", error);
    }

    return next(new CustomError("Failed to create order", 500));
  }

  await Cart.findOneAndDelete({ customer: customer._id });

  // * Send email to customer
  // try {
  //   await sendEmail({
  //     clientEmail: order.email,
  //     subject: "Order Confirmation",
  //     htmlContent: orderCreatedEmail(order),
  //   });
  // } catch (error) {
  //   console.log("Error sending email: ", error);
  // }

  res.status(201).send({
    success: true,
    order,
  });
});

export const getAllOrders = asyncErrorHandler(async (req, res) => {
  const customer = req.customer;
  const { status } = req.query;

  const query = { customer: customer._id };

  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .sort("-createdAt")
    .populate("items.product", "name imageSmall");

  res.status(200).send({
    success: true,
    count: orders.length,
    orders,
  });
});

export const getOrder = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate("customer", "firstName lastName email")
    .populate("items.product", "name imageSmall");

  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  res.status(200).send({
    success: true,
    order,
  });
});

// ? ADMIN
export const adminGetAllOrders = asyncErrorHandler(async (req, res, next) => {
  const { status } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .select("name orderNumber grandTotal phone status createdAt")
    .sort("-createdAt");

  res.status(200).send({
    success: true,
    orders,
  });
});

export const updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "delivered", "shipped", "cancelled"];

  if (!validStatuses.includes(status)) {
    return next(new CustomError("Invalid status", 400));
  }

  const order = await Order.findById(id);

  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  if (order.status === "delivered") {
    return next(
      new CustomError("Cannot change status of a delivered order", 400)
    );
  }

  order.status = status;
  await order.save();

  const updatedOrder = _.pick(order, [
    "name",
    "orderNumber",
    "grandTotal",
    "phone",
    "status",
    "createdAt",
    "_id",
  ]);

  // try {
  //   await sendEmail({
  //     clientEmail: order.email,
  //     subject: "Order Status Update",
  //     htmlContent: orderStatusUpdatedEmail(order),
  //   });
  // } catch (error) {
  //   console.log("Error sending email: ", error);
  // }

  res.status(200).send({
    success: true,
    order: updatedOrder,
  });
});

export const deleteOrder = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  res.status(200).send({
    success: true,
    message: "Order deleted successfully.",
  });
});
