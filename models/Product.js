import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      trim: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    features: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      mobile: String,
      tablet: String,
      desktop: String,
    },
    imageCategory: {
      mobile: String,
      tablet: String,
      desktop: String,
    },
    new: {
      type: Boolean,
      default: false,
    },
    imageSmall: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    gallery: {
      first: {
        mobile: String,
        tablet: String,
        desktop: String,
      },
      second: {
        mobile: String,
        tablet: String,
        desktop: String,
      },
      third: {
        mobile: String,
        tablet: String,
        desktop: String,
      },
    },
    others: {
      slug: String,
      name: String,
      image: {
        mobile: String,
        tablet: String,
        desktop: String,
      },
    },
    includes: {
      type: [
        {
          item: { type: String, required: true },
          quantity: { type: Number, required: true, min: 1 },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export { Product };
