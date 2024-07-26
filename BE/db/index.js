import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = `mongodb+srv://manjeetagarwal123:manjeet123@cluster0.bj6qiwp.mongodb.net/terminalX?retryWrites=true&w=majority`;

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
