import Device from "../../models/device/Device.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomFunction from "../../services/CustomFunction.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const DeviceController = {

  async index(req, res, next) {
    let documents;
    try {
      documents = await Device.find({});
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },

  async store(req, res, next) {
    const { device_key_count } = req.body;

    var temp;
    var resp;

    let water_device_name = "water_level_0";
    for (let index = 0; index < device_key_count; index++) {
      var timestamp = new Date().getTime();
      temp = water_device_name + timestamp;
      const deviceScehma = new Device({
        // device_key_count,
        // water_device_name,
        device_key: temp,
      });

      resp = await deviceScehma.save();
    }

    if (resp) {
      return res.json({
        status: 200,
        data: `${device_key_count} key generated successfully!`,
      });
    }
  },
  
  async update(req, res, next) {
    let documents;
    try {
      documents = await Device.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          status: true,
        },
        {
          new: true,
        }
      );
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },
};
export default DeviceController;
