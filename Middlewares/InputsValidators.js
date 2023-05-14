const { check, validationResult } = require("express-validator");
const validations = {
  ValidateSignUp: [
    check("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Email is invalid"),
    check("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  ValidateSignIn: [
    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Email is invalid"),
    check("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  Validate: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
    }
    next();
  },
};

module.exports = validations;
