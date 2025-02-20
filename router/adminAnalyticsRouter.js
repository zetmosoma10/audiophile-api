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
    // * Fetch total revenue from Paid Orders
    // const totalRevenue = await Order.aggregate([
    //   { $match: { status: "paid" } },
    //   { $group: { _id: null, totalRevenue: { $sum: "$grandTotal" } } },
    // ]);

    // console.log(totalRevenue);

    // // * Gets total Counts
    // const totalCustomers = await Customer.countDocuments();
    // const totalOrders = await Order.countDocuments();
    // const totalProducts = await Product.countDocuments();

    // // * Get 3 latest Orders
    // const latestOrders = await Order.find()
    //   .sort("-createdAt")
    //   .limit(3)
    //   .select("name orderNumber grandTotal status createdAt");

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
