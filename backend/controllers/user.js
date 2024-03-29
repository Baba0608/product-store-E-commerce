const bcrypt = require("bcrypt");

const UserServices = require("../services/user");
const generateToken = require("../utils/generate-jwt");

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await UserServices.findUser(email);

    if (user) {
      return res
        .status(200)
        .json({ success: false, message: "User already exists" });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong." });
      }
      const result = await UserServices.createUser(username, email, hash);
      return res.status(201).json({ success: true, result });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserServices.findUser(email);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false });
      }

      if (result) {
        return res.status(200).json({
          success: true,
          message: "User logged in succesfully.",
          token: generateToken(user._id, user.username),
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Password didnt match" });
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const getDetails = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const result = await UserServices.getDetails(userId);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

module.exports = { signup, login, getDetails };
