import mongoose from "mongoose";

const deviceSchema = mongoose.Schema({
  // water_device_name: { type: String, required: true },
  device_key: { type: String, required: true },
  device_key_count: { type: Number },
  status:{type:Boolean,default:false}
});

export default mongoose.model("Device", deviceSchema, "devices");
