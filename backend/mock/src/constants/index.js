// const ERROR_TYPES = require("../../../json/error-codes.json");
const JWT_SECRET = process.env.JWT_SECRET || "SOME_STRING";
const PORT = process.env.PORT || 4174;
const QUESTIONS_PER_QUIZ = 20;

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
   PASSWORD_RESET: 1
};

/**
 * @type {{[keyof: number]: string}}
 */
const CATEGORIES = {
   1: "History, Politics and Geography",
   2: "Language and Literature",
   3: "Sports",
   4: "Mathematics",
   5: "Pop Culture",
   6: "Technology"
};

module.exports = {
   // ERROR_TYPES,
   JWT_SECRET,
   PORT,
   TOKENS,
   CATEGORIES,
   QUESTIONS_PER_QUIZ
};
