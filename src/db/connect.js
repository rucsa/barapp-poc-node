import mongoose from "mongoose";

const initDB = () => {
  console.log("Trying to connect user dev to database...");

  // -- conn data --
  // vps remote
  //mongoose.connect('mongodb://dev:Triptease@89.46.7.105:27017/tc-admin');
  // vps deploy
  //mongoose.connect("mongodb://dev:Triptease@localhost:27017/tc-admin");
  // local dev
  mongoose.connect('mongodb://localhost:27017/tc-admin');
  // -- end conn data --
  
  mongoose.connection.once("open", () => {
    console.log("connected to database");
  });
  mongoose.connection.on("error", console.error);
};

export default initDB;
