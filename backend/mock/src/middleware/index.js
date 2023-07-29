const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constants");
const { ServerError } = require("../lib");
const db = require("../db");
const logger = require("../lib/logger");
require("colors");

/**
 * @type {apigen.ErrorHandler}
 */
const errorHandler = ({ res, error }) => {
   const { message, status } = error;
   res.statusCode = status;
   res.contentType = "application/json";
   logger.error(`Failed Request to ${res.req.url}: ${message}`.red);
   return {
      fatal: false,
      message,
   };
};

// /**
//  * Convert an error type to a natural language message.
//  * @param {ErrorType} type
//  * @param {any} data
//  * @deprecated
//  */
// function getErrorMessage(type, data = undefined) {
//    switch (type) {
//       case ERROR_TYPES.MALFORMED_REQUEST: {
//          return `The request body has an invalid shape, or the request method is incorrect.`;
//       }
//       case ERROR_TYPES.INVALID_EMAIL: {
//          return `Invalid email.`;
//       }
//       case ERROR_TYPES.INVALID_USERNAME: {
//          return `Invalid username.`;
//       }
//       case ERROR_TYPES.INVALID_PASSWORD: {
//          return `Invalid Password.`;
//       }
//       case ERROR_TYPES.EMAIL_ALREADY_EXISTS: {
//          return `This email is already in use.`;
//       }
//       case ERROR_TYPES.USERNAME_ALREADY_EXISTS: {
//          return `This username is already in use.`;
//       }
//       case ERROR_TYPES.NOT_FOUND: {
//          return `Resource not found.`;
//       }
//       case ERROR_TYPES.UNAUTHORIZED: {
//          return `Authentication required.`;
//       }
//    }
// }

/**
 * @type {apigen.Protector}
 * @throws {apigen.ServerError}
 */
const protect = (req) => {
   const error = new ServerError("Unauthorized request.", 401);
   const { authorization } = req.headers;
   if (!authorization || typeof authorization !== "string") {
      console.log(`1: ${authorization}`);
      throw error;
   }
   if (!authorization.startsWith("Bearer ")) {
      console.log(`2: ${authorization}`);
      throw error;
   }
   const token = authorization.slice(7);
   try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const users = db.getUsers();
      const record = users.find(
         (record) => record.metadata._id === decoded["id"]
      );
      req["user"] = record?.data;
      if (req["user"] === undefined) {
         console.log(`3: ${authorization}`);
         throw new ServerError("User not found", 401);
      }
   } catch {
      console.log(`4: ${authorization}`);
      throw error;
   }
};

module.exports = { errorHandler, protect };
