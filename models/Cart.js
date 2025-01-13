import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CartSchema.virtual("cartTotal").get(function () {
  return this.products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
});

const Cart = mongoose.model("Cart", CartSchema);

export { Cart };
