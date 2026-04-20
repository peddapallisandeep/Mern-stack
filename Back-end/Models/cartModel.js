import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;
