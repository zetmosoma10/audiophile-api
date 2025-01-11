import express from "express";
import {
  getAllOrders,
  createOrder,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderControllers.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";

const router = express.Router();

router.route("/").get(auth, getAllOrders).post(auth, createOrder);
router
  .route("/:orderId")
  .get(auth, getOrder)
  .patch(auth, admin, updateOrderStatus)
  .delete(auth, admin, deleteOrder);

export default router;
