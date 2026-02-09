import { produtModel } from "../Models/productModel.js";

export const addProduct = (req, res) => {
  const { productName, price, category, brand } = req.body;

  try {
    if (!productName || !price || !category || !brand) {
      return res
        .status(404)
        .send({ success: false, message: "All fields are required" });
    }

    const products = new produtModel({
      productName,
      price,
      category,
      brand,
    });
    products.save();

    res.status(200).send({
      success: true,
      message: "successfully added product",
      data: products,
      status: 200,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};
