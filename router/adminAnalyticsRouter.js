import express from "express";
import auth from "./../middlewares/auth.js";
import admin from "./../middlewares/admin.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { Order } from "../models/Order.js";
import { Customer } from "../models/Customer.js";
import { Product } from "../models/Product.js";

const router = express.Router();

router.get(
  "/",
  auth,
  admin,
  asyncErrorHandler(async (req, res) => {
    const [
      totalRevenueResults,
      totalCustomers,
      totalOrders,
      totalProducts,
      latestOrders,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, totalRevenue: { $sum: "$grandTotal" } } },
      ]),
      Customer.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.find()
        .sort("-createdAt")
        .limit(3)
        .select("name orderNumber grandTotal status createdAt"),
    ]);

    const totalRevenue = totalRevenueResults[0]?.totalRevenue || 0;

    res.status(200).send({
      success: true,
      totalOrders,
      totalCustomers,
      totalProducts,
      latestOrders,
      totalRevenue,
    });
  })
);

export default router;
