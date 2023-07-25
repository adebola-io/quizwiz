const ERROR_TYPES = require("../../../json/error-codes.json");
const JWT_SECRET = process.env.JWT_SECRET || "SOME_STRING";
const PORT = process.env.PORT || 4174;

module.exports = {
   ERROR_TYPES,
   JWT_SECRET,
   PORT,
};
