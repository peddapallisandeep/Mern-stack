
import multer from "multer";
import path from "path";
// const express = require("express");
// const fs = require("fs");
// const csv = require("csv-parser");
// const XLSX = require("xlsx");
import express from "express";
import fs from "fs";
import csv from "csv-parser";
import XLSX from "xlsx";
import { fileData } from "../Models/fileModel.js";
import { fileCsv} from "../Models/fileModel.js";
import { Readable } from "stream";

const storage = multer.diskStorage({
    destination :(req, file, cb)=>{
    cb(null,"C:/Users/LENOVO/uplods");
    },
    filename:(req, file, cb)=>{
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        //console.log(file.fieldname,"unique")
        cb(null,file.originalname);
    }
})

const upload = multer({
    storage,
    limits:{
         fileSize:5*1024*1024  
    },
    fileFilter:(req, file, cb)=>{
      if(
        file.mimetype === "text/csv"||
        file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ){
        cb(null,true)
      }
      else{
        cb(new Error("it allows only csv and xl files"));
      }
     
    }
})

export default upload;

const storage1 = multer.memoryStorage();

export const uploadInDatabase = multer({
     storage1,
     limits:{
         fileSize:5*1024*1024  
    },
    fileFilter:(req, file, cb)=>{
      if(
        file.mimetype === "text/csv"||
        file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ){
        cb(null,true)
      }
      else{
        cb(new Error("it allows only csv and xl files"));
      }
     }

})

export const viewFileData = (req, res)=>{
     try{
      const filePath = "C:/Users/LENOVO/uplods/users_sample_100.csv";

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      let currentIndex = 0;
      const paginatedResults = [];

      if(filePath.endsWith(".csv")){
       const results = [];

     fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
      if (currentIndex >= skip && paginatedResults.length < limit)
      {
      paginatedResults.push(row);
      }
    currentIndex++;
      })
     .on("end", () => {
      res.json({
      page,
      limit,
      data: paginatedResults
    });
    });


      }
      else if(filePath.endsWith(".xlsx")){
           const workbook = XLSX.readFile(filePath);
           const sheetName = workbook.SheetNames[0];
           const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      res.json(sheetData);    
       }
       else{
        res.status(400).json({ message: "Unsupported file type" });
       }
     }
     catch(error){
     console.log(error);
     res.status(500).json({message:error.message})
    }
    
}

export const uploadDataInDb = async(req, res)=>{
   try{

    if(!req.file){
        return res.status(400).json({message:"file is not avaliable"})
    }
    
const results = [];
      const stream = Readable.from(req.file.buffer);

  if (req.file.originalname.endsWith(".csv")) {
    stream
    .pipe(csv())
    .on("data", (row) => results.push(row))
    .on("end", async () => {
      await fileCsv.insertMany(results);
      res.json({ message: "Data stored successfully" });
    })
    .on("error", (err) => {
      res.status(500).json({ error: err.message });
    });
  }

  if (req.file.originalname.endsWith(".xlsx")) {
   const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0]; // first sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data.length) {
      return res.status(400).json({ message: "Empty Excel file" });
    }
    await fileData.insertMany(data);

    res.status(200).json({message:"data stored in db"})
   }
   }
   catch(error){
   console.log(error);
   res.status(500).json({message:error.message,success:false})
   }
}