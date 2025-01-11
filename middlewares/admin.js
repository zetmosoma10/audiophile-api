import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/CustomError.js";

const admin = asyncErrorHandler(async (req, res, next) => {
  if (!req.customer.isAdmin) {
    return next(new CustomError("Access denied", 403));
  }

  next();
});

export default admin;
