import mongoose from "mongoose";
import Joi from "joi";
import dayjs from "dayjs";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    name: {
      type: String,
      minLength: [3, "Recipient name must be at least 3 characters long."],
      maxLength: [50, "Recipient name must not exceed 50 characters."],
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    phone: {
      type: String,
      match: [
        /^\d{10}$/,
        "Recipient phone number must be exactly 10 digits long.",
      ],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
      match: [
        /^\d{4}$/,
        "Recipient phone number must be exactly 4 digits long.",
      ],
    },
    country: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["e-money", "cash"],
      required: true,
    },
    eMoneyNumber: {
      type: String,
      select: false,
      required: function () {
        return this.paymentMethod === "e-money";
      },
      minLength: [10, "E-money number must be at least 10 characters long."],
      maxLength: [20, "E-money number must not exceed 20 characters"],
    },
    eMoneyPin: {
      type: String,
      select: false,
      required: function () {
        return this.paymentMethod === "e-money";
      },
      match: [/^\d{4}$/, "E-money PIN must be exactly 4 digits long."],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        normalPrice: {
          type: Number,
          required: true,
        },
        finalPrice: {
          type: Number,
          required: true,
        },
        totalNormalPrice: { type: Number },
        totalFinalPrice: { type: Number },
      },
    ],
    shipping: {
      type: Number,
      default: 89,
    },
    vat: {
      type: Number,
      default: 0.15,
    },
    normalTotal: {
      type: Number,
      required: true,
      min: [0, "Normal Total cannot be negative."],
    },
    finalTotal: {
      type: Number,
      required: true,
      min: [0, "Final Total cannot be negative."],
    },
    grandTotal: {
      type: Number,
      required: true,
      min: [0, "Grand Total cannot be negative."],
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryDate: {
      type: Date,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// * Virtuals
orderSchema.virtual("orderNumber").get(function () {
  return this._id.toString().toUpperCase().slice(-4);
});

// * Middleware to calculate prices
orderSchema.pre("save", function (next) {
  // * Calculate `totalNormalPrice` for each item and round to 2 decimals
  this.items.forEach((item) => {
    item.totalNormalPrice =
      Math.round(item.quantity * item.normalPrice * 100) / 100;
  });

  // * Calculate `totalFinalPrice` for each item and round to 2 decimals
  this.items.forEach((item) => {
    item.totalFinalPrice =
      Math.round(item.quantity * item.finalPrice * 100) / 100;
  });

  // * Calculate `order NormalTotal` for the entire order and round to 2 decimals
  this.normalTotal =
    Math.round(
      this.items.reduce((total, item) => total + item.totalNormalPrice, 0) * 100
    ) / 100;

  // * Calculate `order finalTotal` for the entire order and round to 2 decimals
  this.finalTotal =
    Math.round(
      this.items.reduce((total, item) => total + item.totalFinalPrice, 0) * 100
    ) / 100;

  // * Delivery Date
  this.deliveryDate = new Date(dayjs().add(5, "days"));

  next();
});

// * Middleware to prevent updating items and orderTotal
orderSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.items || update.orderTotal) {
    return next(new Error("Updating items or orderTotal is not allowed."));
  }

  next();
});

// * Joi validation
function validateOrder(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      "string.min": "Name must be at least 3 characters long.",
      "string.max": "Name cannot be longer than 50 characters.",
      "any.required": "Name is required.",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),

    phone: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be exactly 10 digits.",
        "any.required": "Phone number is required.",
      }),

    address: Joi.string().required().messages({
      "any.required": "Address is required.",
    }),

    city: Joi.string().required().messages({
      "any.required": "City is required.",
    }),

    postalCode: Joi.string()
      .pattern(/^\d{4}$/)
      .required()
      .messages({
        "string.pattern.base": "Postal code must be exactly 4 digits.",
        "any.required": "Postal code is required.",
      }),

    country: Joi.string().required().messages({
      "any.required": "Country is required.",
    }),

    paymentMethod: Joi.string().valid("e-money", "cash").required().messages({
      "any.only": 'Payment method must be either "e-money" or "cash".',
      "any.required": "Payment method is required.",
    }),

    eMoneyNumber: Joi.string()
      .when("paymentMethod", {
        is: "e-money",
        then: Joi.string().min(10).max(20).required(),
      })
      .messages({
        "string.min": "eMoney Number must be at least 10 characters long.",
        "string.max": "eMoney Number cannot be longer than 20 characters.",
        "any.required":
          "eMoney Number is required when using e-money payment method.",
      }),

    eMoneyPin: Joi.string()
      .when("paymentMethod", {
        is: "e-money",
        then: Joi.string()
          .pattern(/^\d{4}$/)
          .required(),
      })
      .messages({
        "string.pattern.base": "eMoney PIN must be exactly 4 digits.",
        "any.required":
          "eMoney PIN is required when using e-money payment method.",
      }),
  });

  const { error } = schema.validate(data);
  if (error) {
    return error.details[0].message;
  } else {
    return null;
  }
}

const Order = mongoose.model("Order", orderSchema);

export { Order, validateOrder };
