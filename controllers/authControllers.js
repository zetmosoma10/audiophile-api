import bcrypt from "bcrypt";
import {
  Customer,
  validateLoginInput,
  validateRegisterInput,
} from "../models/Customer.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const register = asyncErrorHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, isAdmin } = req.body;
  const err = validateRegisterInput(req.body);
  if (err) {
    return next(new CustomError(err, 400));
  }

  const isEmailExist = await Customer.findOne({ email });
  if (isEmailExist) {
    return next(new CustomError("Email already exists", 400));
  }

  const customer = await Customer.create({
    firstName,
    lastName,
    email,
    password,
    isAdmin,
  });

  const token = customer.generateJwt();

  res.status(201).send({
    success: true,
    token,
  });
});

export const login = asyncErrorHandler(async (req, res, next) => {
  const err = validateLoginInput(req.body);
  if (err) {
    return next(new CustomError(err, 400));
  }

  const { email, password } = req.body;

  const customer = await Customer.findOne({ email });
  if (!customer) {
    return next(new CustomError("Invalid email or password", 401));
  }

  const isPasswordCorrect = await bcrypt.compare(password, customer.password);
  if (!isPasswordCorrect) {
    return next(new CustomError("Invalid email or password", 401));
  }

  const token = customer.generateJwt();

  res.status(200).send({
    success: true,
    token,
  });
});
