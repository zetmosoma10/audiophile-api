import express from "express";
import auth from "../middlewares/auth.js";
import {
  createProduct,
  getAllProduct,
  getProduct,
} from "../controllers/productControllers.js";

const router = express.Router();

router.route("/").post(auth, createProduct);
router.route("/:categoryId").get(auth, getAllProduct);
router.route("/product-detail/:productId").get(auth, getProduct);

export default router;
