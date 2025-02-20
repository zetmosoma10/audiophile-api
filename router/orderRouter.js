import express from "express";
import {
  getAllOrders,
  createOrder,
  getOrder,
} from "../controllers/orderControllers.js";
import auth from "../middlewares/auth.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

router.route("/").get(auth, getAllOrders).post(auth, createOrder);
router.route("/:id").get(auth, validateObjectId, getOrder);

export default router;
