import { Cart } from "../models/Cart.js";
import { Order, validateOrder } from "../models/Order.js";
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
    recipientName,
    recipientPhoneNumber,
    streetAddress,
    city,
    province,
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

  const order = await Order.create({
    customer: customer._id,
    recipientName,
    recipientPhoneNumber,
    streetAddress,
    city,
    province,
    postalCode,
    country,
    paymentMethod,
    eMoneyNumber,
    eMoneyPin,
    items: cart.products.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.quantity * item.price,
    })),
    total: cart.total,
    grandTotal: cart.grandTotal,
  });

  await Cart.findOneAndDelete({ customer: customer._id });

  try {
    await sendEmail({
      clientEmail: customer.email,
      subject: "Order Confirmation",
      htmlContent: orderCreatedEmail(customer, order.orderNumber),
    });
  } catch (error) {
    console.log("Error sending email: ", error);
  }

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
  const { id } = req.params;
  const order = await Order.findById(id)
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
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];

  if (!validStatuses.includes(status)) {
    return next(new CustomError("Invalid status", 400));
  }

  const order = await Order.findById(id).populate(
    "customer",
    "email firstName"
  );

  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  order.status = status;
  await order.save();

  try {
    await sendEmail({
      clientEmail: order.customer.email,
      subject: "Order Status Update",
      htmlContent: orderStatusUpdatedEmail(
        order.customer,
        order.orderNumber,
        order.status
      ),
    });
  } catch (error) {
    console.log("Error sending email: ", error);
  }

  res.status(200).send({
    success: true,
    order,
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
