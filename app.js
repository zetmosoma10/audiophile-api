import express from "express";
import customer from "./router/authRouter.js";
import globalErrorMiddleware from "./middlewares/globalErrorMiddleware.js";
import catchAllRoutes from "./middlewares/catchAllRoutes.js";
process.env.NODE_ENV = "production";

const app = express();

app.use(express.json());
app.use("/api/auth/register", customer);
app.use("*", catchAllRoutes);
app.use(globalErrorMiddleware);

export default app;
