import { Category, validateCategory } from "../models/Category.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const createCategory = asyncErrorHandler(async (req, res, next) => {
  const err = validateCategory(req.body);
  if (err) {
    return next(new CustomError(err, 400));
  }

  const category = await Category.create({
    name: req.body.name,
    categoryImage: req.body.categoryImage,
  });

  res.status(201).send({
    success: true,
    category,
  });
});

export const getAllCategories = asyncErrorHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).send({
    success: true,
    categories,
  });
});

export const deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedCategory = await Category.findByIdAndDelete(id);

  if (!deletedCategory) {
    return next(new CustomError("Category already deleted.", 400));
  }

  res.status(200).send({
    success: true,
  });
});
