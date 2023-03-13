require("dotenv").config();
const jwt = require("jsonwebtoken");
const { responseHandler } = require("../utils/responseHandler");
const adminModel = require('../models/admin.model')

exports.verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  const token =
    (header && header.split(" ")[1]) || (req.cookies && req.cookies.authToken);

  if (!token) {
    return responseHandler(res, "Unauthorized", 403);
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { id } = decoded;
      
      const admin = adminModel.findById(id)
      if(!admin) return responseHandler(res, "Unauthorized", 403)
      
      req.user = id;

      return next();
    } catch (err) {
      console.log("Error in decoding token", err);

      if (err.name === "TokenExpiredError") {
        return responseHandler(res, "Unauthorized.", 401);
      } else {
        return responseHandler(res, "Unauthorized.", 403);
      }
    }
  }
};
