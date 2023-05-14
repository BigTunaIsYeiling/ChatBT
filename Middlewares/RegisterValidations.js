const AsyncHandler = require("express-async-handler");
const User = require("../Models/UsersModel");
const { compare } = require("bcryptjs");
module.exports = {
  loginValidations: AsyncHandler(async (req, res, next) => {
    let errors = [];
    const { email, password } = req.body;
    if (!email || !password) {
      errors.push("Please provide all fields");
      return res.status(400).json({ errors });
    }
    const user = await User.findOne({ email });
    if (!user) {
      errors.push("User not found");
      return res.status(400).json({ errors });
    }
    const match = await compare(password, user.password);
    if (!match) {
      errors.push("Password is incorrect");
      return res.status(400).json({ errors });
    }
    req.user = user;
    next();
  }),
  SignupValidations: AsyncHandler(async (req, res, next) => {
    let errors = [];
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      errors.push("Please provide all fields");
      return res.status(400).json({ errors });
    }
    const user = await User.findOne({ email });
    if (user) {
      errors.push("That Email is already taken");
      return res.status(400).json({ errors });
    }
    next();
  }),
};
