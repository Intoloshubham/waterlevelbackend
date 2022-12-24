import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    product_id:{ type: String, required:true}
})

export default mongoose.model('Product',productSchema,'products');