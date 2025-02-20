import { Product } from "../models/Product.js";
import { asyncErrorHandler } from "./../utils/asyncErrorHandler.js";
import { CustomError } from "./../utils/CustomError.js";

export const createProduct = asyncErrorHandler(async (req, res) => {
  const product = await Product.create({
    slug: req.body.slug,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    discount: req.body.discount,
    imageSmall: req.body.imageSmall,
    features: req.body.features,
    category: req.body.category,
    image: {
      mobile: req.body.image?.mobile,
      tablet: req.body.image?.tablet,
      desktop: req.body.image?.desktop,
    },
    gallery: {
      first: {
        mobile: req.body.gallery.first?.mobile,
        tablet: req.body.gallery.first?.tablet,
        desktop: req.body.gallery.first?.desktop,
      },
      second: {
        mobile: req.body.gallery.second?.mobile,
        tablet: req.body.gallery.second?.tablet,
        desktop: req.body.gallery.second?.desktop,
      },
      third: {
        mobile: req.body.gallery.third?.mobile,
        tablet: req.body.gallery.third?.tablet,
        desktop: req.body.gallery.third?.desktop,
      },
    },
    others: {
      slug: req.body.others.slug,
      name: req.body.others.name,
      image: {
        mobile: req.body.others.image?.mobile,
        tablet: req.body.others.image?.tablet,
        desktop: req.body.others.image?.desktop,
      },
    },
    includes: req.body.includes,
  });

  res.status(201).send({
    success: true,
    product,
  });
});

export const getAllProduct = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find().select("others");

  res.status(200).send({
    success: true,
    products,
  });
});

export const getProductsByCategory = asyncErrorHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const products = await Product.find({ category: id }).populate(
      "category",
      "name"
    );

    if (products.length === 0) {
      return next(
        new CustomError("Products with given category not found.", 404)
      );
    }

    res.status(200).send({
      success: true,
      count: products.length,
      products,
    });
  }
);

export const getProduct = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new CustomError("Product not found.", 404));
  }

  res.status(200).send({
    success: true,
    product,
  });
});

// ? ADMIN
export const adminGetAllProduct = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find()
    .select("name price stock category")
    .populate("category", "name");

  res.status(200).send({
    success: true,
    products,
  });
});

export const updateProduct = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const productInDb = await Product.findById(id);

  if (!productInDb) {
    return next(new CustomError("Product not found", 404));
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        slug: req.body.slug || productInDb.slug,
        name: req.body.name || productInDb.name,
        description: req.body.description || productInDb.description,
        price: req.body.price || productInDb.price,
        stock: req.body.stock || productInDb.stock,
        discount: req.body.discount || productInDb.discount,
        features: req.body.features || productInDb.features,
        category: req.body.category || productInDb.category,
        image: {
          mobile: req.body.image?.mobile || productInDb.image.mobile,
          tablet: req.body.image?.tablet || productInDb.image.tablet,
          desktop: req.body.image?.desktop || productInDb.image.desktop,
        },
        gallery: {
          first: {
            mobile:
              req.body.gallery.first?.mobile ||
              productInDb.gallery.first.mobile,
            tablet:
              req.body.gallery.first?.tablet ||
              productInDb.gallery.first.tablet,
            desktop:
              req.body.gallery.first?.desktop ||
              productInDb.gallery.first.desktop,
          },
          second: {
            mobile:
              req.body.gallery.second?.mobile ||
              productInDb.gallery.second.mobile,
            tablet:
              req.body.gallery.second?.tablet ||
              productInDb.gallery.second.tablet,
            desktop:
              req.body.gallery.second?.desktop ||
              productInDb.gallery.second.desktop,
          },
          third: {
            mobile:
              req.body.gallery.third?.mobile ||
              productInDb.gallery.third.mobile,
            tablet:
              req.body.gallery.third?.tablet ||
              productInDb.gallery.third.tablet,
            desktop:
              req.body.gallery.third?.desktop ||
              productInDb.gallery.third.desktop,
          },
        },
        others: req.body.others || productInDb.others,
        includes: req.body.includes || productInDb.includes,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).send({
    success: true,
    product: updatedProduct,
  });
});

export const deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return next(new CustomError("Product already deleted", 400));
  }

  res.status(200).send({
    success: true,
    message: "Product deleted successfully",
  });
});
