import mongoose from "mongoose"; 

const fileSchema = new mongoose.Schema({
      name: String,
      email: String,
      age: Number,
      city: String,
      salary: Number
})

export const fileData = mongoose.model("file",fileSchema);

const fileCsvSchema = new mongoose.Schema({
        name: String,
        email: String,
        age: Number,
        city: String,
        salary: Number
})
export const fileCsv = mongoose.model("FileCsv",fileCsvSchema);

const dbToDbSchema = mongoose.Schema({
        name: String,
        email: String,
        age: Number,
        city: String,
        salary: Number
}) 

export const DBTODB = mongoose.model("FileCsv_Backup",dbToDbSchema);