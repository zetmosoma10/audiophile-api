import express from "express";
import customer from "./router/authRouter.js";

const app = express();

app.use(express.json());
app.use("/api/auth/register", customer);

export default app;
