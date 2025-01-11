import express from "express";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/productControllers.js";

const router = express.Router();

router.route("/").post(auth, admin, createProduct);
router.route("/:categoryId").get(getAllProduct);
router
  .route("/product-detail/:productId")
  .get(getProduct)
  .patch(auth, admin, updateProduct)
  .delete(auth, admin, deleteProduct);

export default router;
