import express from "express";
import auth from "../middlewares/auth.js";
import {
  createProduct,
  getAllProduct,
} from "../controllers/productControllers.js";

const router = express.Router();

router.route("/").post(auth, createProduct).get(auth, getAllProduct);

export default router;
