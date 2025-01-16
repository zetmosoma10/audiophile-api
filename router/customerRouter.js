import express from "express";
import {
  getAllCustomers,
  getLoggedInCustomer,
  deleteCustomer,
  deleteProfileAccount,
} from "../controllers/customerControllers.js";
import auth from "../middlewares/auth.js";
import admin from "./../middlewares/admin.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

router.route("/me").get(auth, getLoggedInCustomer);
router.route("/").get(auth, admin, getAllCustomers);
router.route("/delete-profile-account").delete(auth, deleteProfileAccount);
router.route("/:id").delete(auth, admin, validateObjectId, deleteCustomer);

export default router;
