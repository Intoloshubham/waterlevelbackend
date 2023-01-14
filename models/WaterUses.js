import mongoose from "mongoose";
const waterUsesSchema = mongoose.Schema({
  no_of_users: { type: String },
  tank_shape: { type: Number },
  tank_length: { type: Number },
  tank_breadth: { type: Number },
  tank_diameter: { type: Number },
});
export default mongoose.model("WaterUse", waterUsesSchema, "waterUses");
