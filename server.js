import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";

mongoose
  .connect(process.env.DB_CONN_STR)
  .then((data) => console.log(`Successfull Connected to database...`))
  .catch((error) => console.log("FAILD DB connection...", error));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server listen at port: ${port}`);
});
