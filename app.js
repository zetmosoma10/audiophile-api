import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./router/authRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import customerRouter from "./router/customerRouter.js";
import productRouter from "./router/productRouter.js";
import orderRouter from "./router/orderRouter.js";
import cartRouter from "./router/cartRouter.js";
import globalErrorMiddleware from "./middlewares/globalErrorMiddleware.js";
import catchAllRoutes from "./middlewares/catchAllRoutes.js";
// process.env.NODE_ENV = "production";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "public");
// http://localhost:3000/images/users/user1.jpg

app.use(express.json());
app.use(express.static(publicPath));
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/customers", customerRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/carts", cartRouter);
app.use("*", catchAllRoutes);
app.use(globalErrorMiddleware);

export default app;
