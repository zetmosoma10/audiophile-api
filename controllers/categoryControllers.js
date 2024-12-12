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
  });

  res.status(201).send({
    success: true,
    category,
  });
});
