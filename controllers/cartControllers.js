import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const getCartItems = asyncErrorHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ customer: req.customer._id });

  if (!cart) {
    return next(new CustomError("Cart not found.", 404));
  }

  res.status(200).send({
    success: true,
    count: cart.products.length,
    cart,
  });
});

export const addItemToCart = asyncErrorHandler(async (req, res, next) => {
  const customerId = req.customer._id;
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    return next(new CustomError("Quantity must be at least 1.", 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new CustomError("Product not found.", 404));
  }

  let cart = await Cart.findOne({ customer: customerId });

  // *  If cart doesn't exist, create a new one
  if (!cart) {
    cart = new Cart({
      customer: customerId,
      products: [
        {
          quantity,
          product: productId,
          normalPrice: product.price,
          finalPrice: product.finalPrice,
          name: product.others.name,
          image: product.imageSmall,
        },
      ],
    });
  } else {
    // * Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    // * If the product exists, update the quantity
    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // * If the product doesn't exist, add it to the cart
      cart.products.push({
        quantity,
        product: productId,
        normalPrice: product.price,
        finalPrice: product.finalPrice,
        name: product.others.name,
        image: product.imageSmall,
      });
    }
  }

  await cart.save();

  res.status(201).send({
    success: true,
    count: cart.products.length,
    cart,
  });
});

export const updateCartItem = asyncErrorHandler(async (req, res, next) => {
  const customerId = req.customer._id;
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ customer: customerId });
  if (!cart) {
    return next(new CustomError("Cart not found.", 404));
  }

  const productIndex = cart.products.findIndex((item) => {
    return item.product.toString() === productId;
  });

  if (productIndex === -1) {
    return next(new CustomError("Product not found.", 404));
  }

  if (quantity < 1) {
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );
  } else {
    cart.products[productIndex].quantity = quantity;
  }

  await cart.save();

  res.status(200).send({
    success: true,
    count: cart.products.length,
    cart,
  });
});

export const removeAllItemsInCart = asyncErrorHandler(
  async (req, res, next) => {
    const customerId = req.customer._id;

    const cart = await Cart.findOneAndDelete({ customer: customerId });

    if (!cart) {
      return next(new CustomError("Cart not Found.", 404));
    }

    res.status(204).send(null);
  }
);
