import express from "express";
import mongoos from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import cron from "node-cron";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import upload,{viewFileData,uploadDataInDb,uploadInDatabase} from "./Files/fileService.js";
import { fileCsv } from "./Models/fileModel.js";
import path from "path";

import {
  userRegistration,
  userLogin,
  getAllUsers,
  verifyToken,
  getOneUser,
  editUser,
  userDelete,
} from "./Config/User.js";
import { addProduct } from "./Config/Product.js";
import cors from "cors";
import validator from "validator";
import { cartItems } from "./Config/Cart.js";
import e from "express";
import { csvDatafromDb, databseToDatabase } from "./Exports/exportFromDb.js";
import { fileURLToPath } from "url";
import { isUtf8 } from "buffer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

const PORT = 4000;

app.use(cors());

app.use(express.json());

dotenv.config();

const dataConnection = async () => {
  try {
    // const conn = await mongoos.connect(process.env.MONGO_URI);
    const conn = await mongoos.connect("mongodb://localhost:27017/mydb");
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log("Error while connecting to database", err);
    process.exit(1);
  }
};
await dataConnection();


app.post("/user", userRegistration);
app.post("/login", userLogin);
app.get("/getall", getAllUsers);
app.post("/prod", verifyToken, addProduct);
app.get("/getone/:id", getOneUser);
app.put("/edit/:id", editUser);
app.delete("/delete/:id", userDelete);
app.post("/api/cart", cartItems);
app.post("/api/upload",upload.single("file"),(req, res)=>{
       try{
     if(!req.file)
      {
      return res.status(400).json({message:"file not uploaded", success:false})
      }
      res.status(200).json({ message: "File uploaded successfully",
      file: req.file})
       }
       catch(error){
  console.log(error);
  res.status(500).json({message:error.message,success:false})
       }
})
app.get("/api/file/getData",viewFileData);

app.post("/api/uplode-file-data",uploadInDatabase.single("file"),uploadDataInDb)
app.get("/api/export-csv-data",csvDatafromDb);
app.get("/api/db-db",databseToDatabase)

app.get('/' ,(req, res)=>{
  res.send("hello");
})

app.listen(PORT, (req, res) => {
  console.log("Server is running on port " + PORT);       
});

 