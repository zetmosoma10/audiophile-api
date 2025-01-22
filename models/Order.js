import mongoose from "mongoose";
import Joi from "joi";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    recipientName: {
      type: String,
      minLength: [3, "Recipient name must be at least 3 characters long."],
      maxLength: [50, "Recipient name must not exceed 50 characters."],
      required: true,
    },
    recipientPhoneNumber: {
      type: String,
      match: [
        /^\d{10}$/,
        "Recipient phone number must be exactly 10 digits long.",
      ],
      required: true,
    },
    streetAddress: {
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
      required: function () {
        return this.paymentMethod === "e-money";
      },
      minLength: [10, "E-money number must be at least 10 characters long."],
      maxLength: [20, "E-money number must not exceed 20 characters"],
    },
    eMoneyPin: {
      type: String,
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
        price: {
          type: Number,
          required: true,
        },
        totalPrice: { type: Number },
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
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative."],
    },
    grandTotal: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative."],
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
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
  // * Calculate `totalPrice` for each item
  this.items.forEach((item) => {
    item.totalPrice = item.quantity * item.price;
  });

  // * Calculate `orderTotal` for the entire order
  this.total = this.items.reduce((total, item) => total + item.totalPrice, 0);

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
    recipientName: Joi.string().min(3).max(50).required(),
    recipientPhoneNumber: Joi.string()
      .pattern(/^\d{10}$/)
      .required(),
    streetAddress: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string()
      .pattern(/^\d{4}$/)
      .required(),
    country: Joi.string().required(),
    paymentMethod: Joi.string().valid("e-money", "cash").required(),
    eMoneyNumber: Joi.string().when("paymentMethod", {
      is: "e-money",
      then: Joi.string().min(10).max(20).required(),
    }),
    eMoneyPin: Joi.string().when("paymentMethod", {
      is: "e-money",
      then: Joi.string()
        .pattern(/^\d{4}$/)
        .required(),
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
