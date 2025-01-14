import crypto from "crypto";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import {
  Customer,
  validateLoginInput,
  validateRegisterInput,
  validatePassword,
} from "../models/Customer.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";
import { sendEmail } from "../emails/email.js";
import { resetPasswordEmail } from "../emails/resetPasswordEmail.js";
import { successPasswordResetEmail } from "../emails/successPasswordResetEmail.js";

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

export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  // * 1 -> get email and validate it in db
  const { email } = req.body;
  const customer = await Customer.findOne({ email });

  if (!customer) {
    return next(new CustomError("Provided email does not exist", 400));
  }

  // * 2 -> generate token and save it in db
  const token = customer.createResetPasswordToken();
  await customer.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword?token=${token}&id=${customer._id}`;

  // * 3 -> send email token
  try {
    await sendEmail({
      clientEmail: email,
      subject: "We’ve Received Your Password Reset Request",
      htmlContent: resetPasswordEmail(customer, resetUrl),
    });

    res.status(200).send({
      success: true,
      message: "We have sent password reset link to your email",
    });
  } catch (error) {
    next(
      new CustomError("Error happened while sending reset password email", 500)
    );
  }
});

export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  // * 1 -> Validate token
  const { token, id, password } = req.body;

  const customer = await Customer.findById(id);
  if (!customer) {
    return next(new CustomError("Customer not found", 404));
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  if (customer.resetPasswordToken !== hashedToken) {
    return next(new CustomError("Invalid token provided", 400));
  }

  // * 2 -> check if token is not expired
  const currentTime = dayjs();
  const hasFifteenMinutesPassed = currentTime.isAfter(
    customer.resetPasswordTokenExpire
  );

  if (hasFifteenMinutesPassed) {
    customer.resetPasswordTokenExpire = undefined;
    customer.resetPasswordToken = undefined;
    await customer.save();

    return next(
      new CustomError("Provided token has expired, request another link.", 400)
    );
  }

  // * 3 -> get password & validate it,
  const err = validatePassword({ password });
  if (err) {
    return next(new CustomError(err, 400));
  }

  // * 4 ->  save password to db, reset db token & db token expireTime
  customer.password = password;
  customer.resetPasswordTokenExpire = undefined;
  customer.resetPasswordToken = undefined;
  await customer.save();

  // * 5 -> Generate jwt
  const jwt = customer.generateJwt();

  try {
    await sendEmail({
      clientEmail: customer.email,
      subject: "Your Password Has Been Successfully Reset",
      htmlContent: successPasswordResetEmail(customer),
    });
  } catch (error) {
    console.log(error);
  }

  // * 6 -> Login customer
  res.status(200).send({
    success: true,
    token: jwt,
  });
});
