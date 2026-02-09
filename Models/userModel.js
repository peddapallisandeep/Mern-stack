import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String },
  address: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    pin: { type: Number, required: true },
  },
});

export const userModel = mongoose.model("users", userSchema);
