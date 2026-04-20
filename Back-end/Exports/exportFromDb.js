
import { fileCsv } from "../Models/fileModel.js";
import { Parser } from "json2csv";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { DBTODB } from "../Models/fileModel.js";



export const csvDatafromDb = async(req, res)=> {
  try{
    const data = await fileCsv.find();

    if(!data){
        return res.status(404).json({message:"No Data found"});
    }
    const feilds = Object.keys(data[0]);
    const parser = new Parser({feilds});
    const csv = parser.parse(data);

//        📍 File location
//    const dirPath = path.join(process.cwd(), "C:/Users/LENOVO/ExpoterdFileFrom-db");
    const dirPath = "C:/Users/LENOVO/ExpoterdFileFrom-db";
    const filePath = path.join(dirPath, "users_data.csv");

     // Ensure folder exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

      fs.writeFileSync(filePath, csv);

     res.json({
      message: "Data stored in file successfully",
      filePath,
    });

  }
  catch(error){
  console.log(error);
  res.status(500).json({message:error.message,success:false});
  }
}

export const exportToExcelFile = async (req, res) => {
  try {
    const data = await FileData.find().lean();

    if (!data.length) {
      return res.status(404).json({ message: "No data found" });
    }

    // 📁 Location (same as CSV)
    const dirPath = path.resolve("C:/Users/LENOVO/ExpoterdFileFrom-db");
    const filePath = path.join(dirPath, "users_data.xlsx");

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // 🧾 Convert JSON → Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // 💾 Write Excel file to disk
    XLSX.writeFile(workbook, filePath);

    res.json({
      message: "Excel file stored successfully",
      filePath
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const databseToDatabase = async(req, res)=>{
  try{
       const data = await fileCsv.find();
       if(!data){
        return res.status(404).josn({message:"data is not found in table"});
       }
       await DBTODB.deleteMany({});
       await DBTODB.insertMany(data);
       res.status(200).json({message:"Data stored in db successfuly",success:true});
  }
   catch(error){
   console.log(error);
   res.status(500).json({message:error.message,success:false});
  }
}