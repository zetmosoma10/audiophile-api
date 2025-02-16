import express from "express";
import auth from "../middlewares/auth.js";
import {
  addItemToCart,
  getCartItems,
  updateCartItem,
  removeAllItemsInCart,
} from "../controllers/cartControllers.js";

const router = express.Router();

router
  .route("/")
  .get(auth, getCartItems)
  .post(auth, addItemToCart)
  .patch(auth, updateCartItem)
  .delete(auth, removeAllItemsInCart);

export default router;
