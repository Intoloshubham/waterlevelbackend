import CustomErrorHandler from "../services/CustomErrorHandler";
import CustomFunction from "../services/CustomFunction";
import CustomSuccessHandler from "../services/CustomSuccessHandler";
import { WaterUse } from "../models";

const WaterUsesController = {
  async index(req, res, next) {
    try {
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
  },
  async store(req, res, next) {
    try {
        
      const {
        no_of_users,
        tank_shape,
        tank_length,
        tank_breadth,
        tank_diameter,
      } = req.body;

      const temp = await new WaterUse({
        no_of_users,
        tank_shape,
        tank_length,
        tank_breadth,
        tank_diameter,
      });
      const temp1 = temp.save();
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
  },
};
