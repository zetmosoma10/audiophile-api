import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import compression from "compression";
// import rateLimit from "express-rate-limit";
import sanitize from "express-mongo-sanitize";
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

// rateLimit({
//   windowMs: 15 * 60 * 1000, // * 15 minutes
//   max: 100, // * limit each IP to 100 requests per windowMs // 100 requests
//   message: "Too many requests from this IP, please try again after an hour",
// });


app.use(cors());
app.use(helmet());
app.use(sanitize());
app.use(xss());
app.use((req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use(express.static(publicPath));
// app.use("/api/auth", rateLimit);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/customers", customerRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/carts", cartRouter);
app.use("*", catchAllRoutes);
app.use(globalErrorMiddleware);

export default app;
