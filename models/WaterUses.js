import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const waterUsesSchema = mongoose.Schema({
  unique_id: { type: String, required: true },
  no_of_users: { type: String },
  tank_shape: { type: String },
  tank_height: { type: Number },
  tank_length: { type: Number },
  tank_breadth: { type: Number },
  unit:{type:Number},
  radius: { type: Number },
  tank_diameter: { type: Number },
  volume: { type: Number },
});
export default mongoose.model("WaterUse", waterUsesSchema, "waterUses");
