import express from "express";
import { getLoggedInCustomer } from "../controllers/customerControllers.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.route("/me").get(auth, getLoggedInCustomer);

export default router;
