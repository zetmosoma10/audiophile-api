import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/categoryControllers.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

router.route("/").post(auth, admin, createCategory).get(getAllCategories);
router.route("/:id").delete(auth, admin, validateObjectId, deleteCategory);

export default router;
