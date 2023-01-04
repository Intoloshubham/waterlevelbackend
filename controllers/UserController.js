import { User } from "../models/index.js";
import { userSchema } from "../validators/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";
import CustomFunction from "../services/CustomFunction.js";
import bcrypt from "bcrypt";
import transporter from "../config/emailConfig.js";
import { EMAIL_FROM } from "../config/index.js";
import RefreshToken from "../models/auth/RefreshToken.js";
import Joi from "joi";
import JwtService from "../services/JwtService.js";
import { JWT_SECRET, REFRESH_SECRET } from "../config/index.js";

const UserController = {
  async userRegister(req, res, next) {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { name, mobile, email } = req.body;
    try {
      const mobile_exist = await User.exists({ mobile: mobile }).collation({
        locale: "en",
        strength: 1,
      });
      if (mobile_exist) {
        return next(
          CustomErrorHandler.alreadyExist({
            status: 101,
            msg: "Mobile no is already exist",
          })
        );
      }

      const email_exist = await User.exists({ email: email }).collation({
        locale: "en",
        strength: 1,
      });

      if (email_exist) {
        return next(
          CustomErrorHandler.alreadyExist({
            status: 102,
            msg: "Email already exist",
          })
        );
      }
    } catch (err) {
      return next(err);
    }

    const password = CustomFunction.stringPassword(6);
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    try {
      const result = await userData.save();
      let info = transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: "Login password ",
        text: " Password  " + password,
      });
    } catch (err) {
      return next(err);
    }
    return res.json({ status: 200, data: "User Created Successfully!" });
  },

  async loginUser(req, res, next) {


    const { mobile, password } = req.body;

    let access_token;
    let refresh_token;
    let user_detail;

    try {
      user_detail = await User.findOne({ mobile });
  
      if (!user_detail) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }

    try {
      const match = await bcrypt.compare(password, user_detail.password);
  
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }      
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }

    try {

      access_token = JwtService.sign({ _id: user_detail._id });
      refresh_token = JwtService.sign(
        {
          _id: user_detail._id,
        },
        "1y",
        REFRESH_SECRET
      );
      await RefreshToken.create({ token: refresh_token });
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }

    res.json({ status: 200, access_token, refresh_token, data: user_detail });
  },

  async logoutUser(req, res, next) {
    const refreshSchem = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchem.validate(req.body);
    if (error) {
      return next(error);
    }
    const { refresh_token } = req.body;
    try {
      await RefreshToken.deleteOne({ token: refresh_token });
    } catch (error) {
      return next(new Error("Something went wrong in the database"));
    }
    res.json({ status: 200, data: "Logout Successfully!" });
  },
};

export default UserController;
