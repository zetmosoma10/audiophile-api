import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import joi from "joi";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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

const Customer = mongoose.model("Customer", customerSchema);

export { Customer, validateLoginInput };
