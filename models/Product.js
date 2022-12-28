import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    user_id:{type:String,required:true},
    product_id:{ type: ObjectId, required:true},
    service_used_in:{type:String,required:true}
})

export default mongoose.model('Product',productSchema,'products');