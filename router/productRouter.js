import express from "express";
import auth from "../middlewares/auth.js";
import { createProduct } from "../controllers/productControllers.js";

const router = express.Router();

router.route("/").post(auth, createProduct);

export default router;
