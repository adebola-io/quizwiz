const jwt = require("jsonwebtoken");
const { ERROR_TYPES, JWT_SECRET } = require("../constants");
const { ServerError } = require("../lib");
const { getUsers } = require("../db");
require("colors");

/**
 * @type {apigen.ErrorHandler}
 */
const errorHandler = ({ res, error }) => {
   const { type, status } = error;
   res.statusCode = status;
   res.contentType = "application/json";
   let message = getErrorMessage(type, error.data);
   console.log(`Failed Request to ${res.req.url}: ${message}`.red);
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
         return `The request body has an invalid shape, or the request method is incorrect.`;
      }
      case ERROR_TYPES.INVALID_EMAIL: {
         return `Invalid email.`;
      }
      case ERROR_TYPES.INVALID_USERNAME: {
         return `Invalid username.`;
      }
      case ERROR_TYPES.INVALID_PASSWORD: {
         return `Invalid Password.`;
      }
      case ERROR_TYPES.EMAIL_ALREADY_EXISTS: {
         return `This email is already in use.`;
      }
      case ERROR_TYPES.USERNAME_ALREADY_EXISTS: {
         return `This username is already in use.`;
      }
      case ERROR_TYPES.NOT_FOUND: {
         return `Resource not found.`;
      }
      case ERROR_TYPES.UNAUTHORIZED: {
         return `Authentication required.`;
      }
   }
}

/**
 * @type {apigen.Protector}
 * @throws {apigen.ServerError}
 */
const protect = (req) => {
   const error = new ServerError(ERROR_TYPES.UNAUTHORIZED, 401);
   const { authorization } = req.headers;
   if (!authorization || typeof authorization !== "string") {
      throw error;
   }
   if (!authorization.startsWith("Token ")) {
      throw error;
   }
   const token = authorization.slice(6);
   const decoded = jwt.verify(token, JWT_SECRET);
   req["user"] = getUsers().find((user) => user.id === decoded["id"]);
   if (req["user"] === undefined) {
      throw error;
   }
};

module.exports = { errorHandler, protect };
