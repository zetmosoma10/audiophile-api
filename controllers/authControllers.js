import { Customer } from "../models/Customer.js";

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  const customer = await Customer.create({
    name,
    email,
    password,
    phone,
  });

  res.status(201).send({
    success: true,
    customer,
  });
};
