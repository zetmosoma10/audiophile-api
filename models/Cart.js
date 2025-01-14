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
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative."],
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
    total: {
      type: Number,
    },
    grandTotal: {
      type: Number,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cartSchema.pre("save", function (next) {
  this.total = this.products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  this.grandTotal = this.total + this.shipping + this.total * this.vat;

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export { Cart };
