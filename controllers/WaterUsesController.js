import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";
import { WaterUse } from "../models/index.js";
import Constants  from "../constants/index.js";

const WaterUsesController = {
  async index(req, res, next) {
    try {
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
  },

  async store(req, res, next) {
    try {
      const pie = 3.14;
      const {
        no_of_users,
        tank_shape,
        tank_length,
        tank_breadth,
        tank_diameter,
        tank_height,
      } = req.body;

      switch (tank_shape) {
        case Constants.CYLINDRICAL:
          const radi = tank_diameter / 2;
          const cyl_vol = pie * radi * radi * tank_height;
          const temp_cylinder = new WaterUse({
            no_of_users,
            tank_shape,
            tank_height,
            radi,
            cyl_volume: cyl_vol,
          });
          const temp1 = await temp_cylinder.save();
          break;
        case Constants.CUBOIDAL:
          const cuboid_volume = tank_length * tank_breadth * tank_height;
          const temp_cuboid = new WaterUse({
            no_of_users,
            tank_shape,
            tank_height,
            tank_length,
            tank_breadth,
            cuboid_volume,
          });
          const temp2 = await temp_cuboid.save();
          break;
        default:
          next(CustomErrorHandler.notFound("No Volume exist!"));
          break;
      }
      return res.json({
        status: 200,
        msg: `${tank_shape} volume generated successfully!`,
      });
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
  },
};
export default WaterUsesController;
