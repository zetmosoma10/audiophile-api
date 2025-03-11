import mongoose from "mongoose";
import { Customer } from "../models/Customer.js";
import { Order } from "../models/Order.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customError.js";
import _ from "lodash";

export const getLoggedInCustomer = asyncErrorHandler(async (req, res, next) => {
  const customer = _.pick(req.customer, [
    "_id",
    "firstName",
    "lastName",
    "email",
    "isAdmin",
    "createdAt",
  ]);

  res.status(200).send({
    success: true,
    customer,
  });
});

export const deleteProfileAccount = asyncErrorHandler(
  async (req, res, next) => {
    const id = req.customer._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const customer = await Customer.findByIdAndDelete(id).session(session);

      if (!customer) {
        return next(new CustomError("Customer not found", 404));
      }

      await Order.deleteMany(id).session(session);

      await session.commitTransaction();
      session.endSession();

      res.status(200).send({
        success: true,
        customer,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return next(error);
    }
  }
);

//  ? ADMIN
export const getAllCustomers = asyncErrorHandler(async (req, res) => {
  const { page = 1 } = req.query;

  if (isNaN(page) || page <= 0) {
    return next(new CustomError("Invalid Page number", 400));
  }

  const limit = 5;
  const skip = (page - 1) * limit;
  const customerCount = await Customer.countDocuments();

  if (req.query.page) {
    if (skip >= customerCount) {
      return next(new CustomError("Page not Found", 400));
    }
  }

  const currentPage = parseInt(page, 10);
  const totalPages = Math.ceil(customerCount / limit);
  const totalOrders = customerCount;

  const customers = await Customer.find()
    .select("-password -__v")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  res.status(200).send({
    success: true,
    currentPage,
    totalPages,
    totalOrders,
    customers,
  });
});

export const deleteCustomer = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  // * START TRANSACTION
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customer = await Customer.findByIdAndDelete(id).session(session);

    if (!customer) {
      return next(new CustomError("Customer not found", 404));
    }

    await Order.deleteMany({ customer: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({
      success: true,
      customer,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
});
