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
      orderStats,
      totalCustomers,
      totalOrders,
      totalProducts,
      latestOrders,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, totalRevenue: { $sum: "$grandTotal" } } },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
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

    // * CONVERT ARRAY TO OBJECTS
    const formattedStats = orderStats.reduce((acc, item) => {
      acc[item._id] = item.count;

      return acc;
    }, {});

    res.status(200).send({
      success: true,
      orderStats: formattedStats,
      totalOrders,
      totalCustomers,
      totalProducts,
      latestOrders,
      totalRevenue,
    });
  })
);

export default router;
