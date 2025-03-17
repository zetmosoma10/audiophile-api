import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import compression from "compression";
import rateLimit from "express-rate-limit";
import sanitize from "express-mongo-sanitize";
import { fileURLToPath } from "url";
import authRouter from "./router/authRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import customerRouter from "./router/customerRouter.js";
import productRouter from "./router/productRouter.js";
import orderRouter from "./router/orderRouter.js";
import cartRouter from "./router/cartRouter.js";
import serverStatusRouter from "./router/serverStatusRouter.js";
import adminAuthRouter from "./router/adminAuthRouter.js";
import adminCustomerRouter from "./router/adminCustomerRouter.js";
import adminProductRouter from "./router/adminProductRouter.js";
import adminOrderRouter from "./router/adminOrderRouter.js";
import adminAnalyticRouter from "./router/adminAnalyticsRouter.js";
import globalErrorMiddleware from "./middlewares/globalErrorMiddleware.js";
import catchAllRoutes from "./middlewares/catchAllRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "public");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // * 15 minutes
  max: 100, // * limit each IP to 100 requests per windowMs // 100 requests
  message: "Too many requests from this IP, please try again after an hour",
});

app.use(cors());
app.use(limiter);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(sanitize());
app.use(xss());
app.use((req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use(express.static(publicPath));
app.use("/api/auth", rateLimit);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/health", serverStatusRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/customers", customerRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/carts", cartRouter);
app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin/analytics", adminAnalyticRouter);
app.use("/api/admin/customers", adminCustomerRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("*", catchAllRoutes);
app.use(globalErrorMiddleware);

export default app;
