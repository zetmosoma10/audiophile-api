import mongoose from "mongoose";
import joi from "joi";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
  },
  { timestamps: true }
);

const validateCategory = (data) => {
  const schema = joi.object({ name: joi.string().min(3).max(50).required() });

  const { error } = schema.validate(data);
  return error?.details[0]?.message || null;
};

const Category = mongoose.model("Category", categorySchema);

export { Category, validateCategory };
