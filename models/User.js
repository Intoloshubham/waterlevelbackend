import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{ type: String, required:true},
    mobile:{ type: String, required:true},
    email:{ type: String, required:true},
    password: { type: String},
})

export default mongoose.model('User',userSchema,'users');