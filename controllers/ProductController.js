import { ObjectId } from "mongodb";
import Device from "../models/device/Device.js";
import { Product } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomFunction from "../services/CustomFunction.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";

const ProductController = {
  async index(req, res, next) {
    let documents;
    try {
      documents = await Product.find({user_id:req.params.id});
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },

  async store(req, res, next) {
    try {
      const { service_used_in, product_id,user_id } = req.body;
      const existing_cust_id = await Device.exists({
        _id: product_id,
      }).collation({ locale: "en", strength: 1 });

      if (existing_cust_id) {
        
        const exist_id = await Product.exists({
          product_id: product_id
        }).collation({
          locale: "en",
          strength: 1,
        });

        if (exist_id) {
          return next(
            CustomErrorHandler.alreadyExist({
              msg: "Product Id already exists!",
            })
          );
        }
        const exist = await Product.exists({
          service_used_in: service_used_in,
        }).collation({
          locale: "en",
          strength: 1,
        });

        if (exist) {
          return next(
            CustomErrorHandler.alreadyExist({
              msg: "This Service is already in use!"
            })
          );
        }

        const temp = new Product({ product_id: product_id, service_used_in,user_id:user_id });
        const temp1 = await temp.save();
      } else {
        return next(
          CustomErrorHandler.notExist({
            msg: "Entered Product Id do not exist in database!",
          })
        );
      }
    } catch (error) {
      return next(error);
    }
    res.json({ status: 200, data: "Product Details registered" });
  },
  async update(req, res, next) {
    try {

      const {product_id,service_used_in}=req.body;
      const temp = await Product.findByIdAndUpdate(
        { _id: req.params.id },
        { product_id, service_used_in },
        { new: true }
      );      
    } catch (error) {
      return next(error);
    }
    res.json({status:200,data:'Product details updated successfully'})
  },
};
export default ProductController;
