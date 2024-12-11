import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const getLoggedInCustomer = asyncErrorHandler(async (req, res, next) => {
  const customer = req.customer;

  res.status(200).send({
    success: true,
    customer,
  });
});
