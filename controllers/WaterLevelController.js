import fs from "fs";
import { ObjectId } from "mongodb";
import {
  WaterLevel,
  WaterSetting,
  WaterUse,
  WaterUsesDetails,
} from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";
import CustomFunction from "../services/CustomFunction.js";
import helpers from "../helpers/index.js";
import { socketConn } from "../utils/SocketService.js";
import constants from "../constants/index.js";

const WaterLevelController = {
  async getLedStatus(req, res, next) {
    let documents;
    try {
      documents = await WaterLevel.findOne({
        unique_id: req.params.unique_id,
      }).select("led_status -_id");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },

  async getSumpStatus(req, res, next) {
    let documents;
    try {
      documents = await WaterLevel.findOne({
        unique_id: req.params.unique_id,
      }).select("sump_status -_id");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },

  async getBoreStatus(req, res, next) {
    let documents;
    try {
      documents = await WaterLevel.findOne({
        unique_id: req.params.unique_id,
      }).select("bore_status -_id");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },

  //---------------------
  async updateMotorStatus(req, res, next) {
    if (req.params.unique_id === "undefined") {
      return res.send(
        CustomErrorHandler.idUndefined("Unique ID is undefined!")
      );
    }
    const water_level_id = await helpers.getWaterLevelId(req.params.unique_id);
    const { sump_status, bore_status } = req.body;
    let updateDoc;
    let level;
    let msg;
    let type;
    let mssg;
    let title;
    try {
      if (sump_status || bore_status) {
        if (sump_status == true) {
          const document = await WaterLevel.findById(water_level_id).select(
            "sump_level water_level"
          );
          level = document.water_level;
          if (document.sump_level < 35) {
            return next(
              CustomErrorHandler.inValid(
                "Your sump level is " +
                  document.sump_level +
                  "%. If you want to start sump minimum level is required above 35%."
              )
            );
          }
          updateDoc = {
            $set: {
              motor_status: true,
              sump_status: sump_status,
            },
          };
          msg = "Sump motor is on";
        } else if (bore_status == true) {
          updateDoc = {
            $set: {
              motor_status: true,
              bore_status: bore_status,
            },
          };
          msg = "Bore motor is on";
        }
      } else {
        const document = await WaterLevel.findById(water_level_id).select(
          "sump_status bore_status water_level"
        );
        level = document.water_level;
        if (sump_status == false) {
          if (document.bore_status == true) {
            updateDoc = {
              $set: {
                sump_status: sump_status,
              },
            };
          } else {
            updateDoc = {
              $set: {
                motor_status: false,
                sump_status: sump_status,
              },
            };
          }
          msg = "Sump motor is off";
        } else if (bore_status == false) {
          if (document.sump_status == true) {
            updateDoc = {
              $set: {
                bore_status: bore_status,
              },
            };
          } else {
            updateDoc = {
              $set: {
                motor_status: false,
                bore_status: bore_status,
              },
            };
          }
          msg = "Bore motor is off";
        }
      }

      const filter = { _id: water_level_id };
      const options = { new: true };
      const result = await WaterLevel.findOneAndUpdate(
        filter,
        updateDoc,
        options
      );

      if (result.motor_status == true) {
        WaterLevelController.calculateWaterUsage(
          level,
          req.params.unique_id,
          water_level_id,
          result.water_level
        );
      } else {
        const temresult = await WaterLevel.findOneAndUpdate(
          filter,
          { last_water_level: result.water_level },
          { new: true }
        );
      }

      if (sump_status) {
        type = "SUMP_ON";
        mssg = "Sump motor is On";
        title = "Sump Motor";
      }

      if (sump_status == false) {
        type = "SUMP_OFF";
        mssg = "Sump motor is Off";
        title = "Sump Motor";
      }

      if (bore_status) {
        type = "BORE_ON";
        mssg = "Bore motor is On";
        title = "Bore Motor";
      }

      if (bore_status == false) {
        type = "BORE_OFF";
        mssg = "Bore motor is Off";
        title = "Bore Motor";
      }

      socketConn.emit(
        "notification",
        {
          message: mssg,
          title: title,
        },
        type
      );
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    return res.send(CustomSuccessHandler.success(msg));
  },


  calculateWaterUsage: async (level, uniqueId, water_level_id, water_level) => {
    try {
      const year = CustomFunction.currentYearMonthDay("YYYY");
      const month = CustomFunction.currentYearMonthDay("MM");
      const current_date = CustomFunction.currentDate();
      const current_time = CustomFunction.currentTime();
      const month_name = CustomFunction.monthName();
      const default_start_level = constants.START_LEVEL;
      const default_stop_level = constants.STOP_LEVEL;

      const waterStartStopLevel = await WaterSetting.findOne({
        water_level_id: water_level_id,
      }).select("start_level stop_level");

      const waterUsageId = await WaterUse.exists();

      if (waterUsageId) {
        const waterLastOffLevel = await WaterLevel.findOne({
          unique_id: uniqueId,
        }).select("last_water_level");
        if (
          waterStartStopLevel.start_level >= 20 &&
          waterStartStopLevel.stop_level <= 80
        ) {
          if (waterLastOffLevel.last_water_level != 0) {
            level = waterLastOffLevel.last_water_level - water_level;
          } else {
            level = waterStartStopLevel.stop_level - water_level;
          }
        } else {
          level = default_stop_level - default_start_level;
        }
        const exist = await WaterUsesDetails.exists({
          water_uses_id: waterUsageId._id,
          month: month,
          year: year,
          unique_id: uniqueId,
        });

        if (!exist) {
          const waterSchema = new WaterUsesDetails({
            water_uses_id: waterUsageId._id,
            unique_id: uniqueId,
            year: year,
            month: month,
            month_name: month_name,
            // total_usage: level,
            waterUsage: [
              {
                level: level,
              },
            ],
          });
          const temp = await waterSchema.save();  
        } else {
          const temp = await WaterUsesDetails.findByIdAndUpdate(
            {
              _id: exist._id,
            },
            {
              $push: {
                waterUsage: {
                  present_date: current_date,
                  in_time: current_time,
                  level: level,
                },
              },
            },
            { new: true }
          );
        }
      }
    } catch (error) {
      console.log("error");
    }
  },

  async totalUsage(req, res, next) {
    try {
      const tot_usage = await WaterUsesDetails.aggregate([
        {
          $match: { unique_id: req.params.unique_id },
        },
        { $unwind: "$waterUsage" },
        {
          $group: {
            _id: 0,
            
            // _id: "$waterUsage.level",
            total_usage: { $sum: "$waterUsage.level" },
          },
        },
      ]);
      const [{ _id: valueOfA, total_usage: valueOfB }] = tot_usage;

      res.send({ status: 200, total_usage: valueOfB });
    } catch (error) {
      next(CustomErrorHandler.serverError());
    }
  },

  async updateLedStatus(req, res, next) {
    // const water_level_id = await getWaterLevelId(req.params.unique_id);
    if (req.params.unique_id === "undefined") {
      return res.send(
        CustomErrorHandler.idUndefined("Unique ID is undefined!")
      );
    }
    const water_level_id = await helpers.getWaterLevelId(req.params.unique_id);

    const { led_status } = req.body;
    try {
      const filter = { _id: water_level_id };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          led_status: led_status,
        },
      };
      const result = await WaterLevel.updateOne(filter, updateDoc, options);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.send(
      CustomSuccessHandler.success("Led status updated successfully")
    );
  },

  async updateSumpStatus(req, res, next) {
    // const water_level_id = await getWaterLevelId(req.params.unique_id);
    if (req.params.unique_id === "undefined") {
      return res.send(
        CustomErrorHandler.idUndefined("Unique ID is undefined!")
      );
    }
    const water_level_id = await helpers.getWaterLevelId(req.params.unique_id);
    const { sump_status } = req.body;
    try {
      const filter = { _id: water_level_id };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          sump_status: sump_status,
        },
      };
      const result = await WaterLevel.updateOne(filter, updateDoc, options);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.send(
      CustomSuccessHandler.success("Sump status updated successfully")
    );
  },

  async updateBoreStatus(req, res, next) {
    // const water_level_id = await getWaterLevelId(req.params.unique_id);
    if (req.params.unique_id === "undefined") {
      return res.send(
        CustomErrorHandler.idUndefined("Unique ID is undefined!")
      );
    }
    const water_level_id = await helpers.getWaterLevelId(req.params.unique_id);

    const { bore_status } = req.body;
    try {
      const filter = { _id: water_level_id };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          bore_status: bore_status,
        },
      };
      const result = await WaterLevel.updateOne(filter, updateDoc, options);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.send(
      CustomSuccessHandler.success("Bore status updated successfully")
    );
  },

  async getWaterLevel(req, res, next) {
    let documents;
    try {
      documents = await WaterLevel.findOne({
        unique_id: req.params.unique_id,
      }).select("-__v");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },

  async prevWaterLevel(req, res, next) {
    let documents;
    let prevLevel;
    try {
      documents = await WaterLevel.findOne({
        unique_id: req.params.unique_id,
      }).select("-__v");
      setTimeout(() => {
        prevLevel = parseFloat(documents.water_level);
        return res.json({ status: 200, prevLevel });
      }, 120000);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
  },

  async updateWaterLevel(req, res, next) {
    // const water_level_id = await getWaterLevelId(req.params.unique_id);
    if (req.params.unique_id === "undefined") {
      return res.send(
        CustomErrorHandler.idUndefined("Unique ID is undefined!")
      );
    }
    const water_level_id = await helpers.getWaterLevelId(req.params.unique_id);
    try {
      const { water_level, ph_level } = req.body;
      const filter = { _id: water_level_id };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          water_level: water_level,
          ph_level: ph_level,
        },
      };
      const result = await WaterLevel.updateOne(filter, updateDoc, options);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.send(
      CustomSuccessHandler.success("Water Level updated successfully")
    );
  },

  async updateSumpLevel(req, res, next) {
    if (req.params.unique_id === "undefined") {
      return res.send(
        CustomErrorHandler.idUndefined("Unique ID is undefined!")
      );
    }
    const water_level_id = await helpers.getWaterLevelId(req.params.unique_id);
    try {
      const { sump_level } = req.body;
      const filter = { _id: water_level_id };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          sump_level,
        },
      };
      const result = await WaterLevel.updateOne(filter, updateDoc, options);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.send(
      CustomSuccessHandler.success("Sump Level updated successfully")
    );
  },

  async getWaterLevelImage(req, res, next) {
    if (req.params.unique_id === "undefined") {
      return res.send(
        CustomErrorHandler.idUndefined("Unique ID is undefined!")
      );
    }
    try {
      const image_file_name = "water_" + req.params.unique_id;
      // if (fs.existsSync(base64_string.path)) {
      if (fs.existsSync("uploads/files/" + image_file_name + ".txt")) {
        const base64_string = fs.createReadStream(
          "uploads/files/" + image_file_name + ".txt",
          "utf-8"
        );
        base64_string.pipe(res);
      } else {
        res.send(CustomErrorHandler.notExist("File not exist"));
      }
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    // base64_string.pipe(res);
  },

  async saveWaterLevelImage(req, res, next) {
    if (req.params.unique_id === "undefined") {
      return res.send(
        CustomErrorHandler.idUndefined("Unique ID is undefined!")
      );
    }
    const { image } = req.body;
    try {
      const replace_2F = image.replace(/%2F/g, "/"); // %2F = /
      const final_image = replace_2F.replace(/%2B/g, "+"); // %2B = +
      const image_file_name = "water_" + req.params.unique_id;

      const date = CustomFunction.currentDate();
      const time = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/kolkata",
      });

      fs.writeFileSync(
        "uploads/files/" + image_file_name + ".txt",
        JSON.stringify({
          image: "data:image/png;base64," + final_image,
          date: date,
          time: time,
        })
      );
      fs.writeFileSync(
        "uploads/images/" + image_file_name + ".gif",
        final_image,
        { encoding: "base64" },
        function (err) {
          console.log("File created");
        }
      );
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.send(
      CustomSuccessHandler.success(
        "Water Level image frames updated successfully"
      )
    );
  },
};

// async function getWaterLevelId(unique_id){
//     const exist = await WaterLevel.exists({ unique_id: unique_id });
//     let water_level_id;
//     if (!exist) {
//         const water = new WaterLevel({
//             unique_id: unique_id,
//         });
//         const result = await water.save();
//         water_level_id = result._id;
//     } else {
//         water_level_id = exist._id;
//     }
//     return water_level_id;
// }

export default WaterLevelController;

// import path from 'path';
// import fs from 'fs';
// import { ObjectId } from 'mongodb';
// import WebSocket from 'ws';
// import { WS_PORT } from '../config/index.js'
// import CustomErrorHandler from '../services/CustomErrorHandler.js';
// import CustomSuccessHandler from '../services/CustomSuccessHandler.js';
// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => cb(null, 'assets/images/water_level/uploads/'),
// //     filename: (req, file, cb) => {
// //         const uniqueName = `${Date.now()}-${Math.round(
// //             Math.random() * 1e9
// //         )}${path.extname(file.originalname)}`;
// //         // 3746674586-836534453.png
// //         // console.log(req)
// //         cb(null, uniqueName);
// //     }
// // });

// // const handleMultipartData = multer({
// //     storage,
// //     limits: { fileSize: 1000000 * 1 },
// // }).single('image'); // 1mb

// const WaterLevelController = {

//     async waterLevel(req, res, next){

//         const {image} = req.body;
//         try {
//             const replace_2F = image.replace(/%2F/g, '/'); // %2F = /
//             const final_image = replace_2F.replace(/%2B/g, '+'); // %2B = +

//             console.log(final_image);

//             // const writeStream = fs.createWriteStream('inputfile.text');
//             // final_image.pipe(writeStream);

//             // fs.writeFileSync('inputfile.text', final_image);

//             // const replace_2F = image.split("%2F").join("/"); // %2F = /
//             // const final_image = replace_2F.split("%2B").join("+"); // %2B = +

//             const image_path = "uploads/";
//             // const image_name = `${Date.now()}_${Math.round(Math.random() * 1e9)}.png`;
//             const image_name = "uploads/water.gif";

//             // fs.writeFileSync('inputfile.txt', final_image);
//             // fs.writeFileSync('inputfile.txt', JSON.stringify([{image:'data:image/png;base64,'+final_image}]))
//             fs.writeFileSync('inputfile.txt', JSON.stringify({image:'data:image/png;base64,'+final_image}))

//             // fs.writeFileSync(image_path + image_name,final_image, {encoding: 'base64'}, function(err){
//             fs.writeFileSync(image_name,final_image, {encoding: 'base64'}, function(err){
//                 console.log('File created');
//             });

//             return res.send('Water level status updated successfully');
//         } catch (err) {
//             return next(err);
//         }

//     },

//     async index(req, res, next){
//         const base64_string = fs.createReadStream('inputfile.txt','utf-8');
//         base64_string.pipe(res);
//     },

// }

// export default WaterLevelController;
