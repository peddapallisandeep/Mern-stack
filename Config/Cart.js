import CartModel from "../Models/cartModel.js";

export const cartItems = async (req, res) => {
  try {
    const { name, text } = req.body;

    if (!name || !text) {
      return res
        .status(404)
        .send({ success: false, message: "All fields are required" });
    }
    await CartModel({
      name,
      text,
    }).save();
    res.status(200).send({
      success: true,
      message: "Item added to cart successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: err.message });
  }
};
