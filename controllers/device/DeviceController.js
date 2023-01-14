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
    const { device_key_count, version } = req.body;

    var temp;
    var resp;
    let mon;
    let yr;
    let num;

    try {
      yr = new Date().getFullYear().toString().slice(-2);

      let d = new Date();

      let mont = d.getMonth();
      if (mont == 0) {
        mon = "0" + (++mont).toString();
      } else {
        mon = mont;
      }

      for (let index = 0; index < device_key_count; index++) {
        num = CustomFunction.randomNumber();
        temp = mon + yr + "INTE" + num + "NICS" + version;
        const deviceScehma = new Device({
          // device_key_count,
          // water_device_name,
          device_key: temp,
        });

        resp = await deviceScehma.save();
      }
    } catch (error) {
      return next(CustomErrorHandler.serverError());
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
