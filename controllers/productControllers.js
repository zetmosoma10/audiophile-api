import { Product } from "../models/Product.js";
import { asyncErrorHandler } from "./../utils/asyncErrorHandler.js";

export const createProduct = asyncErrorHandler(async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    features: req.body.features,
    category: req.body.category,
    mainImage: {
      large: req.body.mainImage.large,
      medium: req.body.mainImage.medium,
      small: req.body.mainImage.small,
    },
    previewImage: {
      large: req.body.previewImage.large,
      medium: req.body.previewImage.medium,
      small: req.body.previewImage.small,
    },
    images: req.body.images,
    boxContents: req.body.boxContents,
  });

  res.status(201).send({
    success: true,
    product,
  });
});

export const getAllProduct = asyncErrorHandler(async (req, res) => {
  const products = await Product.find();

  res.status(200).send({
    success: true,
    products,
  });
});
