import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    //Connecting to a existing DB
    await mongoose.connect("mongodb://127.0.0.1:27017/url-shortener-bot");
    console.log("mongo db connected");
  } catch (error) {
    console.log("There is some error to connect the DB");
  }
};

