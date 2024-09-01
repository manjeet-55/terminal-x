import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.BACKEND_URL;
console.log("process.env.BACKEND_URL",process.env.BACKEND_URL)
  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
  };

  try {
    await mongoose.connect(mongoUri, connectionOptions);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
