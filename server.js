import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";

process.on("uncaughtException", (error) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(`${error.name}: ${error.message}`);

  process.exit(1);
});

import app from "./app.js";

mongoose
  .connect(process.env.DB_CONN_STR)
  .then((data) => console.log(`Successfully Connected to database...`))
  .catch((error) => console.log("FAILED DB connection...", error));

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Server listen at port: ${port}`);
});

process.on("unhandledRejection", (error) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(`${error.name}: ${error.message}`);

  server.close(() => {
    process.exit(1);
  });
});
