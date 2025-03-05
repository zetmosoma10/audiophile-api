import express from "express";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  adminGetAllProduct,
} from "../controllers/productControllers.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

router
  .route("/")
  .get(auth, admin, adminGetAllProduct)
  .post(auth, admin, createProduct);
router
  .route("/:id")
  .get(auth, admin, validateObjectId, getProduct)
  .patch(auth, admin, validateObjectId, updateProduct)
  .delete(auth, admin, validateObjectId, deleteProduct);

export default router;
