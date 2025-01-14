import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import joi from "joi";
import dayjs from "dayjs";

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 150,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

customerSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  } catch (err) {
    next(err);
  }

  next();
});

customerSchema.methods.generateJwt = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
    },
    process.env.JWT_SECRET_STR,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

// * 2 -> generate token and save it in db
customerSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = dayjs().add(15, "minute").toDate();

  return resetToken;
};

const validateRegisterInput = (data) => {
  const schema = joi.object({
    firstName: joi.string().min(3).max(50).required(),
    lastName: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).max(150).required(),
    isAdmin: joi.boolean().optional(),
  });

  const { error } = schema.validate(data);
  if (error) {
    return error.details[0].message;
  } else {
    return null;
  }
};

const validateLoginInput = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).max(150).required(),
  });

  const { error } = schema.validate(data);
  if (error) {
    return error.details[0].message;
  } else {
    return null;
  }
};

const validatePassword = (data) => {
  const schema = joi.object({
    password: joi.string().min(4).max(150).required(),
  });

  const { error } = schema.validate(data);
  if (error) {
    return error.details[0].message;
  } else {
    return null;
  }
};

const Customer = mongoose.model("Customer", customerSchema);

export {
  Customer,
  validateLoginInput,
  validateRegisterInput,
  validatePassword,
};
