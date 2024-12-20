import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
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
    orderTotal: { type: Number },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// * Middleware to calculate prices
orderSchema.pre("save", function (next) {
  // * Calculate `totalPrice` for each item
  this.items.forEach((item) => {
    item.totalPrice = item.quantity * item.price;
  });

  // * Calculate `orderTotal` for the entire order
  this.orderTotal = this.items.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  next();
});

const Order = mongoose.model("Order", orderSchema);

export { Order };
