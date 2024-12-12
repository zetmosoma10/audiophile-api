import express from "express";
import { createCategory } from "../controllers/categoryControllers.js";
import auth from "../middlewares/auth.js";


const router = express.Router();

router.route("/").post(auth, createCategory);

export default router;
