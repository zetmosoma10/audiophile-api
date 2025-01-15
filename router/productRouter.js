import express from "express";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  getProductsByCategory,
} from "../controllers/productControllers.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

router.route("/").get(getAllProduct).post(auth, admin, createProduct);
router.route("/:id").get(validateObjectId, getProductsByCategory);
router
  .route("/product-detail/:id")
  .get(validateObjectId, getProduct)
  .patch(auth, admin, validateObjectId, updateProduct)
  .delete(auth, admin, validateObjectId, deleteProduct);

export default router;
