import cookieParser from "cookie-parser";
import express from "express";
import ErrorMiddleware from "./middlewares/ErrorMiddleware.js"
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import orderRouter from "./routes/order.routes.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

// Routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/order", orderRouter)

app.use(ErrorMiddleware)

export default app;

