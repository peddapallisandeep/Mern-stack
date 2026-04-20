import mangoos from "mongoose";

const productSchema = new mangoos.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
});

export const produtModel = mangoos.model("products", productSchema);
