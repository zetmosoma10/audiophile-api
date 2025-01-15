import mongoose from "mongoose";
import { CustomError } from "../utils/customError.js";

export default function validateObjectId(req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError("Invalid Object ID", 400));
  }

  next();
}
