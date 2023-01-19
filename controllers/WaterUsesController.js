import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";
import { WaterUse } from "../models/index.js";
import Constants from "../constants/index.js";
import { ObjectId } from "mongodb";

const WaterUsesController = {
  async index(req, res, next) {
    try {
      const temp = await WaterUse.find();

      res.send({ status: 200, data: temp });
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
  },

  async store(req, res, next) {
    try {
      const pie = 3.14;
      let volume = 0;
      let radius = 0;
      let updateDoc;

      const {
        no_of_users,
        tank_shape,
        tank_length,
        tank_breadth,
        tank_diameter,
        tank_height,
        unique_id,
        unit,
      } = req.body;

      const exist = await WaterUse.exists({
        unique_id,
      }).collation({
        locale: "en",
        strength: 1,
      });

      if (tank_shape === Constants.CUBOIDAL) {
        volume = tank_length * tank_breadth * tank_height;
      } else {
        radius = tank_diameter / 2;
        volume = pie * radius * radius * tank_height;
      }

      if (exist) {
        // const filter = { _id: exist._id };
        // const options = { upsert: true };
        // updateDoc = {
        //     $set: {
        //       unique_id:unique_id,
        //       no_of_users:no_of_users,
        //       tank_shape:tank_shape,
        //       tank_length:tank_length,
        //       tank_breadth:tank_breadth,
        //       tank_height:tank_height,
        //       radius: radius,
        //       volume: volume,
        //     },
        //   };
        // const result = await WaterUse.updateOne(filter, updateDoc, options);
        await WaterUse.deleteMany({});
      }
      const temp = new WaterUse({
        unique_id,
        no_of_users,
        tank_shape,
        tank_length,
        tank_breadth,
        tank_height,
        unit,
        radius: radius,
        volume: volume,
      });

      const tem = await temp.save();

      // if (exist) {

      //   const shape_exist = await WaterUse.exists({tank_shape}).collation({
      //     locale: "en",
      //     strength: 1,
      //   });

      //   if (tank_shape === Constants.CYLINDRICAL) {
      //     radius = tank_diameter / 2;
      //     volume = pie * radius * radius * tank_height;

      //     if (shape_exist) {

      //       const filter = { unique_id: unique_id };
      //       const options = { upsert: true };
      //       const updateDoc = {
      //         $set: {
      //           unique_id,
      //           no_of_users,
      //           tank_shape,
      //           tank_height,
      //           radius,
      //           volume: volume,
      //         },
      //       };
      //       const result = await WaterUse.updateOne(filter, updateDoc, options);
      //     }else{

      //     }
      //   } else if (tank_shape === Constants.CUBOIDAL) {
      //     volume = tank_length * tank_breadth * tank_height;

      //     // const temp_cuboid = new WaterUse({
      //     //   no_of_users,
      //     //   tank_shape,
      //     //   tank_height,
      //     //   tank_length,
      //     //   tank_breadth,
      //     //   cuboid_volume,
      //     // });

      //     const shape_exist = await WaterUse.exists({
      //       tank_shape,
      //     }).collation({
      //       locale: "en",
      //       strength: 1,
      //     });
      //     if (shape_exist) {
      //       const cubfilter = { unique_id: unique_id };
      //       const cuboptions = { upsert: true };
      //       const cubupdateDoc = {
      //         $set: {
      //           unique_id,
      //           no_of_users,
      //           tank_shape,
      //           tank_length,
      //           tank_breadth,
      //           tank_height,
      //           radius,
      //           volume: volume,
      //         },
      //       };
      //       const cubresult = await WaterUse.updateOne(
      //         cubfilter,
      //         cubupdateDoc,
      //         cuboptions
      //       );
      //     }
      //   }
      // } else {

      //   const temp = new WaterUse({
      //     unique_id,
      //     no_of_users,
      //     tank_shape,
      //     tank_length,
      //     tank_breadth,
      //     tank_height,
      //     radius: tank_shape == Constants.CYLINDRICAL ? tank_diameter / 2 : "",
      //     volume:
      //       tank_shape == Constants.CYLINDRICAL
      //         ? pie * (tank_diameter / 2) * (tank_diameter / 2) * tank_height
      //         : tank_length * tank_breadth * tank_height,
      //   });

      //   const tem = await temp.save();

      // }

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
