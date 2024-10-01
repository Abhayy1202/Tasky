import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({ path: "./env" });
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const ConnectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${"Tasky"}`
    );
    console.log(`\n MongoDB connected!! ${ConnectionInstance.connection.host}`);
    //   console.log(ConnectionInstance)
  } catch (error) {
    console.error("DBconnect Error", error);
    process.exit(1);
  }
};

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Errr:", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection failed!!!", err);
  });