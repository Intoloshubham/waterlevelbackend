import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    user_id:{type:ObjectId,required:true},
    product_id:{ type: String, required:true},
    service_used_in:{type:String, required:true},
    status:{ type:Boolean, default:false}
})

export default mongoose.model('Product',productSchema,'products');