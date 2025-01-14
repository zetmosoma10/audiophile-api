import express from "express";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/authControllers.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").patch(resetPassword);

export default router;
