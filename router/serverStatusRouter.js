import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const dbConnection = mongoose.connection.readyState === 1;

    if (!dbConnection) {
      res.status(500).send({
        success: false,
        message: "DATABASE disconnected",
      });
    }

    res.status(200).send({
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server down",
    });
  }
});

export default router;
