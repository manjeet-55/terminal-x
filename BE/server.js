import express from "express";
import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import cors from "cors";
import authMiddleware from "./middleware/authMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
const app = express();
app.use(express.json());

dotenv.config({});
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to termiAI!");
});
app.use("/api/auth", authRoutes);
app.use(authMiddleware);
app.use("/api", workspaceRoutes);
app.use(errorMiddleware);
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
