import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
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
  features: {
    type: String,
    trim: true,
    required: true,
  },
  mainImage: {
    large: String,
    medium: String,
    small: String,
  },
  previewImage: {
    large: String,
    medium: String,
    small: String,
  },
  images: {
    type: [
      {
        large: String,
        medium: String,
        small: String,
      },
    ],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  boxContents: {
    type: [
      {
        item: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

export { Product };
