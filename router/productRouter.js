import express from "express";
import auth from "../middlewares/auth.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/productControllers.js";

const router = express.Router();

router.route("/").post(auth, createProduct);
router.route("/:categoryId").get(auth, getAllProduct);
router
  .route("/product-detail/:productId")
  .get(auth, getProduct)
  .patch(auth, updateProduct)
  .delete(auth, deleteProduct);

export default router;
