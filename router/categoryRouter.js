import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/categoryControllers.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(auth, createCategory).get(auth, getAllCategories);
router.route("/:id").delete(auth, deleteCategory);

export default router;
