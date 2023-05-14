const Urouter = require("express").Router();
const upload = require("../Middlewares/AvatarMulter");
const {
  getallUsers,
  Login,
  Register,
  UpdateUser,
  AccessRefresh,
  GetAccess,
  DeleteUser,
  LogOut,
} = require("../Controllers/UserControllers");
const verifyAccess = require("../Middlewares/Authorization");
const {
  ValidateSignIn,
  Validate,
  ValidateSignUp,
} = require("../Middlewares/InputsValidators");
const {
  loginValidations,
  SignupValidations,
} = require("../Middlewares/RegisterValidations");
Urouter.route("/").get(verifyAccess, getallUsers);
Urouter.route("/login").post(ValidateSignIn, Validate, loginValidations, Login);
Urouter.route("/Register").post(
  ValidateSignUp,
  Validate,
  SignupValidations,
  Register
);
Urouter.route("/UpdateUser").put(
  verifyAccess,
  upload.single("newAvatar"),
  UpdateUser
);
Urouter.route("/Refresh").post(verifyAccess, AccessRefresh, GetAccess);
Urouter.route("/GetAccess").get(verifyAccess, GetAccess);
Urouter.route("/LogOut").post(verifyAccess, LogOut);
Urouter.route("/DeleteUser").delete(verifyAccess, DeleteUser);
module.exports = Urouter;
