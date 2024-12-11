import { Customer } from "../models/Customer.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import _ from "lodash";

export const getLoggedInCustomer = asyncErrorHandler(async (req, res, next) => {
  const customer = _.omit(req.customer, ["password", "__v"]);

  res.status(200).send({
    success: true,
    customer,
  });
});

export const getAllCustomers = asyncErrorHandler(async (req, res) => {
  const customers = await Customer.find().select("-password -__v");

  res.status(200).send({
    success: true,
    customers,
  });
});
