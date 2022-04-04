import mongoose from "mongoose";

const initDB = () => {
  console.log("Trying to connect user dev to database...");
  //mongoose.connect('mongodb://dev:Triptease@89.46.7.105:27017/tc-admin');
  //mongoose.connect("mongodb://dev:Triptease@localhost:27017/tc-admin");
  mongoose.connect('mongodb://localhost:27017/tc-admin');
  mongoose.connection.once("open", () => {
    console.log("connected to database");
  });
  mongoose.connection.on("error", console.error);
};

export default initDB;
