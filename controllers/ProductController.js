import { Product } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomFunction from "../services/CustomFunction.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";

const ProductController = {
  async index(req, res, next) {
    let documents;
    try {
      documents = await Product.find().select('product_id -_id');;
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },
  async store(req, res, next) {
    try {
      const { product_id } = req.body;
      const exist = await Product.exists({ product_id: product_id }).collation({
        locale: "en",
        strength: 1,
      });

      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist({
            msg: "Product Id already exists!",
          })
        );
      }

      const temp = new Product({ product_id: product_id });
      const temp1 = await temp.save();
      console.log("🚀 ~ file: ProductController.js:25 ~ store ~ temp1", temp1);
    } catch (error) {
      return next(error);
    }
    res.json({ status: 200, data: "Product Id registered permanently" });
  },
};
export default ProductController;
