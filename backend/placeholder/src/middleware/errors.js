require("colors");

/**
 * @readonly
 */
const ERROR_TYPES = require("../../../json/error-codes.json");

/**
 * @type {apigen.ErrorHandler}
 */
const errorHandler = ({ res, error }) => {
   const { type, status } = error;
   res.statusCode = status;
   res.contentType = "application/json";
   let message = getErrorMessage(type, error.data);
   console.log(`Failed Request: ${message}.`.red);
   return {
      fatal: false,
      feedback: { message, code: type },
   };
};

/**
 * Convert an error type to a natural language message.
 * @param {ErrorType} type
 * @param {any} data
 */
function getErrorMessage(type, data = undefined) {
   switch (type) {
      case ERROR_TYPES.MALFORMED_REQUEST: {
         return `The request body has an invalid shape, or the request method is incorrect`;
      }
      case ERROR_TYPES.INVALID_EMAIL: {
         return `Invalid email`;
      }
      case ERROR_TYPES.INVALID_USERNAME: {
         return `Invalid username`;
      }
      case ERROR_TYPES.INVALID_PASSWORD: {
         return `Invalid Password`;
      }
      case ERROR_TYPES.EMAIL_ALREADY_EXISTS: {
         return `Email already exists`;
      }
      case ERROR_TYPES.USERNAME_ALREADY_EXISTS: {
         return `Username already exists`;
      }
      case ERROR_TYPES.NOT_FOUND: {
         return `Resource not found`;
      }
   }
}

module.exports = { ERROR_TYPES, errorHandler };
