import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("Public"));
app.use(cookieParser());

//route import
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js"
import adminRouter from "./routes/admin.routes.js"

//route declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/admin", adminRouter);




//   http://localhost:8000/api/v1/users/register

export { app };
