import { Product } from "../models/Product.js";
import { asyncErrorHandler } from "./../utils/asyncErrorHandler.js";
import { CustomError } from "./../utils/CustomError.js";

export const createProduct = asyncErrorHandler(async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    features: req.body.features,
    category: req.body.category,
    mainImage: {
      large: req.body.mainImage?.large,
      medium: req.body.mainImage?.medium,
      small: req.body.mainImage?.small,
    },
    previewImage: {
      large: req.body.previewImage?.large,
      medium: req.body.previewImage?.medium,
      small: req.body.previewImage?.small,
    },
    images: req.body.images,
    boxContents: req.body.boxContents,
  });

  res.status(201).send({
    success: true,
    product,
  });
});

export const getAllProduct = asyncErrorHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const products = await Product.find({ category: categoryId });

  if (!products) {
    return next(
      new CustomError("Products with given category not found.", 404)
    );
  }

  res.status(200).send({
    success: true,
    count: products.length,
    products,
  });
});

export const getProduct = asyncErrorHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new CustomError("Product not found.", 404));
  }

  res.status(200).send({
    success: true,
    product,
  });
});

export const deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const { productId } = req.params;

  const deletedProduct = await Product.findByIdAndDelete(productId);
  console.log(deletedProduct);

  if (!deletedProduct) {
    return next(new CustomError("Product already deleted", 400));
  }

  res.status(200).send({
    success: true,
  });
});

export const updateProduct = asyncErrorHandler(async (req, res, next) => {
  const { productId } = req.params;

  const productInDb = await Product.findById(productId);
  console.log(productInDb);
  if (!productInDb) {
    return next(new CustomError("Product not found", 404));
  }

  const { mainImage = {}, previewImage = {} } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        name: req.body.name || productInDb.name,
        description: req.body.description || productInDb.description,
        price: req.body.price || productInDb.price,
        features: req.body.features || productInDb.features,
        category: req.body.category || productInDb.category,
        mainImage: {
          large: mainImage.large || productInDb.mainImage.large,
          medium: mainImage.medium || productInDb.mainImage.medium,
          small: mainImage.small || productInDb.mainImage.small,
        },
        previewImage: {
          large: previewImage.large || productInDb.previewImage.large,
          medium: previewImage.medium || productInDb.previewImage.medium,
          small: previewImage.small || productInDb.previewImage.small,
        },
        images: req.body.images || productInDb.images,
        boxContents: req.body.boxContents || productInDb.boxContents,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).send({
    success: true,
    product: updatedProduct,
  });
});
