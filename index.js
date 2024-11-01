import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/userRoutes.js";
import connectionRoutes from "./src/routes/connectionRoutes.js";
import workFlowRoutes from "./src/routes/workFlowRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Using Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.set("trust proxy", 1);
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", userRoutes);
app.use("/connection", connectionRoutes);
app.use("/workflows", workFlowRoutes);
app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({ do: "SMILE", start: "Developing something great & keep :) :)" });
});

app
  .listen(process.env.PORT, () => {
    console.log(`listening to port ${process.env.PORT}`);
  })
  .on("error", (err) => {
    console.log(err);
    process.exit();
  })
  .on("close", () => {
    process.exit();
  });
