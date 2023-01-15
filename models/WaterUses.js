import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const waterUsesSchema = mongoose.Schema({
  unique_id:{type:ObjectId,required:true},
  no_of_users: { type: String },
  tank_shape: { type: String },
  tank_height:{type:Number},
  tank_length: { type: Number },
  tank_breadth: { type: Number },
  radius:{type:Number},
  tank_diameter: { type: Number },
  cyl_volume:{type:Number 
  },
  cuboid_volume:{type:Number}
});
export default mongoose.model("WaterUse", waterUsesSchema, "waterUses");
