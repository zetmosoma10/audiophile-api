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

export const getAllCustomers = asyncErrorHandler(async (req, res) => {
  const customers = await Customer.find().select("-password -__v");

  res.status(200).send({
    success: true,
    count: customers.length,
    customers,
  });
});

export const deleteCustomer = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const customer = await Customer.findByIdAndDelete(id);

  if (!customer) {
    return next(new CustomError("Customer not found", 404));
  }

  await Order.deleteMany({ customer: id });

  res.status(200).send({
    success: true,
    customer,
  });
});

export const deleteProfileAccount = asyncErrorHandler(
  async (req, res, next) => {
    const id = req.customer._id;
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return next(new CustomError("Customer not found", 404));
    }

    await Order.deleteMany(id);

    res.status(200).send({
      success: true,
      customer,
    });
  }
);
