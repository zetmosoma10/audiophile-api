import bcrypt from "bcrypt";
import { Customer } from "../models/Customer.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

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

export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const customer = await Customer.findOne({ email });
  if (!customer) {
    return next(new CustomError("Invalid email or password", 401));
  }

  const isPasswordCorrect = await bcrypt.compare(password, customer.password);
  if (!isPasswordCorrect) {
    return next(new CustomError("Invalid email or password", 401));
  }
  s;
  const token = customer.generateJwt();

  res.status(200).send({
    success: true,
    token,
  });
});
