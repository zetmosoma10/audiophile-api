import { Customer } from "../models/Customer.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const register = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  const customer = await Customer.create({
    name,
    email,
    password,
    phone,
  });

  const token = customer.generateJwt();

  res.status(201).send({
    success: true,
    token,
  });
});
