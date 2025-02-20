import express from "express";
import {
  adminGetAllOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderControllers.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

router.route("/").get(auth, admin, adminGetAllOrders);
router
  .route("/:id")
  .get(auth, admin, validateObjectId, getOrder)
  .patch(auth, admin, validateObjectId, updateOrderStatus)
  .delete(auth, admin, validateObjectId, deleteOrder);

export default router;
