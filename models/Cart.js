import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1."],
        },
        normalPrice: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative."],
        },
        finalPrice: {
          type: Number,
          required: true,
          min: [0, "finalPrice cannot be negative."],
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
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
      default: 0,
    },
    finalTotal: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "1d",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cartSchema.pre("save", function (next) {
  // * Calculate `normalTotal` for the cart and round to 2 decimals
  this.normalTotal =
    Math.round(
      this.products.reduce(
        (sum, item) => sum + item.quantity * item.normalPrice,
        0
      ) * 100
    ) / 100;

  // * Calculate `finalTotal` for the cart and round to 2 decimals
  this.finalTotal =
    Math.round(
      this.products.reduce(
        (sum, item) => sum + item.quantity * item.finalPrice,
        0
      ) * 100
    ) / 100;

  // * Calculate `grandTotal` for the cart and round to 2 decimals
  this.grandTotal =
    Math.round(
      (this.finalTotal + this.shipping + this.finalTotal * this.vat) * 100
    ) / 100;

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export { Cart };
