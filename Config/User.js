import { userModel } from "../Models/userModel.js"; // adjust the path if needed
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

export const userRegistration = async (req, res) => {
  const {
    firstName,
    secondName,
    email,
    password,
    address: { state, city, country, pin },
  } = req.body;

  try {
    // Create new user document

    if (
      !firstName ||
      !secondName ||
      !email ||
      !password ||
      !state ||
      !city ||
      !country ||
      !pin
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res
        .status(201)
        .send({ success: false, message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel({
      firstName,
      secondName,
      email,
      password: hashedPassword,
      address: {
        state,
        city,
        country,
        pin,
      },
    });
    user.role = "user"; // default role
    await user.save();

    const otp = Math.floor(100000 * Math.random() + 90000);

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      OTP: otp,
    });
  } catch (err) {
    console.error("Error while registering user:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//console.log(otp);

export const userLogin = async (req, res) => {
  console.log("Login request received", req.body);
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ success: false, message: "invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);

    res.status(200).send({
      success: true,
      message: "login successful",
      data: otp,
      token: token,
    });
  } catch (err) {
    res.ststus(500).send({ success: false, message: err.message });
  }
};

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log(authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.sign(token, process.env.JWT_SECRET);

    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

export const getOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);

    if (!user) {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export const editUser = async (req, res) => {
  console.log("Edit user request received");
  try {
    const { id } = req.params;
    const { email, firstName, secondName, address } = req.body;

    const user = await userModel.updateOne(
      { _id: id },
       { $set:{ firstName, secondName, email, address }}
    );

    if (user.modifiedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found or data is same as previous",
      });
    }
    res.status(200).send({
      success: true,
      message: "User updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: err.message });
  }
};

export const userDelete = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const userDelete = await userModel.findByIdAndDelete(id);

    if (!userDelete) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: err.message });
  }
};


