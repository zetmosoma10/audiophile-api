import express from "express";
import {
  getLoggedInCustomer,
  deleteProfileAccount,
} from "../controllers/customerControllers.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.route("/me").get(auth, getLoggedInCustomer);
router.route("/delete-profile-account").delete(auth, deleteProfileAccount);

export default router;
