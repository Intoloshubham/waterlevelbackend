import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const waterLevelSchema = mongoose.Schema({
    unique_id:{ type: String, required:true, unique:true },
    led_status:{ type: Number, default:0 },
    motor_status:{ type: Boolean, default:false },
    sump_status:{ type: Boolean, default:false },
    bore_status:{ type: Boolean, default:false },
    water_level:{ type: String, default:null },
    sump_level:{ type: String, default:null },
    ph_level:{ type: String, default:null },
});

export default mongoose.model('WaterLevel', waterLevelSchema, 'waterLevels');