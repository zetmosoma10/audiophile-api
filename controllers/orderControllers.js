import mongoose from "mongoose";
import _ from "lodash";
import { Cart } from "../models/Cart.js";
import { Order, validateOrder } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { asyncErrorHandler } from "./../utils/asyncErrorHandler.js";
import { sendEmail } from "../emails/email.js";
import { orderCreatedEmail } from "../emails/orderCreatedEmail.js";
import { orderStatusUpdatedEmail } from "../emails/orderStatusUpdatedEmail.js";
import { CustomError } from "../utils/CustomError.js";

export const createOrder = asyncErrorHandler(async (req, res, next) => {
  const customer = req.customer;

  const err = validateOrder(req.body);
  if (err) {
    return next(new CustomError(err, 400));
  }

  const cart = await Cart.findOne({ customer: customer._id });

  if (!cart || cart.products.length === 0) {
    return next(new CustomError("Cart is empty", 400));
  }

  // * START SESSION
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // * UPDATE STOCK
    for (const item of cart.products) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new CustomError("Product not found", 404);
      }

      if (product.stock < item.quantity) {
        if (product.stock > 0) {
          throw new CustomError(
            `Only (${product.stock})  ${product.name} left in the stock`,
            400
          );
        } else {
          throw new CustomError(`${product.name} is out of stock`, 400);
        }
      }

      product.stock -= item.quantity;
      await product.save({ session });
    }

    // * CREATE ORDER
    const [order] = await Order.create(
      [
        {
          customer: customer._id,
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          city: req.body.city,
          postalCode: req.body.postalCode,
          country: req.body.country,
          paymentMethod: req.body.paymentMethod,
          eMoneyNumber: req.body.eMoneyNumber,
          eMoneyPin: req.body.eMoneyPin,
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
        },
      ],
      { session }
    );

    // *DELETE CART
    await Cart.findOneAndDelete({ customer: customer._id }, { session });

    // * COMMIT TRANSACTION
    await session.commitTransaction();
    session.endSession();

    // * Send email to customer
    try {
      await sendEmail({
        clientEmail: order.email,
        subject: "Order Confirmation",
        htmlContent: orderCreatedEmail(order),
      });
    } catch (error) {
      console.log("Error sending email: ", error);
    }

    res.status(201).send({
      success: true,
      order: order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return next(error);
  }
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
  let page = parseInt(req.query.page, 10) || 1;

  if (isNaN(page) || page <= 0) {
    return next(new CustomError("Invalid Page number", 400));
  }

  const limit = 5;
  const skip = (page - 1) * limit;
  const query = status ? { status } : {};

  const orderCount = await Order.countDocuments(query);

  if (orderCount === 0) {
    return res.status(200).send({
      success: true,
      currentPage: 1,
      totalPages: 0,
      totalOrders: 0,
      orders: [],
    });
  }

  if (skip >= orderCount) {
    return next(new CustomError("Page not Found", 400));
  }

  const currentPage = page;
  const totalPages = Math.ceil(orderCount / limit);
  const totalOrders = orderCount;

  const orders = await Order.find(query)
    .select("name orderNumber grandTotal phone status createdAt")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  res.status(200).send({
    success: true,
    currentPage,
    totalPages,
    totalOrders,
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

  try {
    await sendEmail({
      clientEmail: order.email,
      subject: "Order Status Update",
      htmlContent: orderStatusUpdatedEmail(order),
    });
  } catch (error) {
    console.log("Error sending email: ", error);
  }

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
