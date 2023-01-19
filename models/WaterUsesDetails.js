
import { ObjectId } from "mongodb";
import mongoose, { mongo } from "mongoose";
import CustomFunction from "../services/CustomFunction.js";

const time=CustomFunction.currentTime();
const date=CustomFunction.currentDate();

const waterUsesDetailsSchema = mongoose.Schema({
  water_uses_id: { type: ObjectId, required: true },
  unique_id: { type: String, required: true },  
  year: { type:Number},
  month: { type: Number },
  month_name: { type: String },
  waterUsage:[{
      present_date:{type:String, default:date},
      in_time:{ type:String, default:time},
      level:{type:Number}
  }],
});

export default mongoose.model('WaterUsesDetails',waterUsesDetailsSchema,"waterUsesDetails");
