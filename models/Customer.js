import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    phone: {
      type: String,
      required: true,
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

const Customer = mongoose.model("Customer", customerSchema);

export { Customer };
