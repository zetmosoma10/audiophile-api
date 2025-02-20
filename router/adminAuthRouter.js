import express from "express";
import {
  adminLogin,
  adminForgotPassword,
  adminRegister,
  resetPassword,
} from "../controllers/authControllers.js";

const router = express.Router();

router.route("/register").post(adminRegister);
router.route("/login").post(adminLogin);
router.route("/forgotPassword").post(adminForgotPassword);
router.route("/resetPassword").patch(resetPassword);

export default router;
