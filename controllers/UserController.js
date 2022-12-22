import { User } from "../models/index.js";
import { userSchema } from "../validators/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";
import CustomFunction from "../services/CustomFunction.js";
import bcrypt from "bcrypt";
import transporter from "../config/emailConfig.js";
import { EMAIL_FROM } from "../config/index.js";

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
          CustomErrorHandler.alreadyExist("Mobile no is already exist")
        );
      }

      const email_exist = await User.exists({ email: email }).collation({
        locale: "en",
        strength: 1,
      });
      if (email_exist) {
        return next(CustomErrorHandler.alreadyExist("Email is already exist"));
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
    const user_detail = await User.findOne({ mobile });
    if (!user_detail) {
      return next(CustomErrorHandler.wrongCredentials());
    }
    const match = await bcrypt.compare(password, user_detail.password);

    if (!match) {
      return next(CustomErrorHandler.wrongCredentials());
    }
    res.json({ status: 200, data: user_detail });
  },
};

export default UserController;
