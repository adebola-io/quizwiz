// const ERROR_TYPES = require("../../../json/error-codes.json");
const JWT_SECRET = process.env.JWT_SECRET || "SOME_STRING";
const PORT = process.env.PORT || 4174;

// Duplicated as type because JSDoc doesn't preserve literal types.
/**
 * @typedef {{
 * EMAIL_VERIFICATION: 0,
 * PASSWORD_RESET: 1
 * }} TokenTypesObject
 */
/**
 * @type {TokenTypesObject}
 */
const TOKENS = {
   EMAIL_VERIFICATION: 0,
   PASSWORD_RESET: 1,
};

module.exports = {
   // ERROR_TYPES,
   JWT_SECRET,
   PORT,
   TOKENS,
};
