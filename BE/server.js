import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
app.use(express.json());

dotenv.config({});
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/api", authRoutes);
app.use("/api", workspaceRoutes);
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
