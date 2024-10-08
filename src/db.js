import mongoose from "mongoose";


export const database = async () => {
    try {
      await mongoose.connect(
        `mongodb+srv://aldairtorres507:aldair2024@cluster0.fs4xiq8.mongodb.net/BlockNotas?retryWrites=true&w=majority&appName=Cluster0`
      );
      console.log("database is connect sucefull");
    } catch (error) {
      console.log("error en conexion",error);
    }
  };
  