import express from "express";
import {
  getAllCustomers,
  getLoggedInCustomer,
} from "../controllers/customerControllers.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.route("/me").get(auth, getLoggedInCustomer);
router.route("/").get(auth, getAllCustomers);

export default router;
