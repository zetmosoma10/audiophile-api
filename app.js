import express from "express";
import authRouter from "./router/authRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import customerRouter from "./router/customerRouter.js";
import globalErrorMiddleware from "./middlewares/globalErrorMiddleware.js";
import catchAllRoutes from "./middlewares/catchAllRoutes.js";
// process.env.NODE_ENV = "production";

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/customers", customerRouter);
app.use("*", catchAllRoutes);
app.use(globalErrorMiddleware);

export default app;
