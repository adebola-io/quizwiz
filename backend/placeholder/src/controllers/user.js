const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { utils, ServerError } = require("../lib");
const { ERROR_TYPES } = require("../middleware");

require("colors");

/**
 * Adds a new user.
 * @param {apigen.IncomingMessage} req Server request.
 * @throws {apigen.ServerError}
 */
function addNewUser(req) {
   if (req.method !== "POST") {
      throw new ServerError(ERROR_TYPES.MALFORMED_REQUEST);
   }

   const { username, emailAddress, password } = req.body;

   if (typeof username !== "string" || !utils.isValidUsername(username)) {
      throw new ServerError(ERROR_TYPES.INVALID_USERNAME);
   }
   if (typeof emailAddress !== "string" || !utils.isValidEmail(emailAddress)) {
      throw new ServerError(ERROR_TYPES.INVALID_EMAIL);
   }
   if (typeof password !== "string" || !utils.isValidPassword(password)) {
      throw new ServerError(ERROR_TYPES.INVALID_PASSWORD);
   }
   const users = db.getUsers();
   for (const previousUser of users) {
      if (previousUser.emailAddress == emailAddress) {
         throw new ServerError(ERROR_TYPES.EMAIL_ALREADY_EXISTS);
      }
      if (previousUser.username == username) {
         throw new ServerError(ERROR_TYPES.USERNAME_ALREADY_EXISTS);
      }
   }
   const hashedPassword = bcrypt.hashSync(password, 10);
   const user = {
      id: users.createId(),
      username,
      password: hashedPassword,
      emailAddress,
      quizzesPlayed: 0,
      rapidFireCheckpoint: null,
      stars: 0,
      successRate: 0,
   };
   /**@type {CreateUserResponse} */
   let response = {
      username: user.username,
      token: generateUserToken(user.id),
   };
   users.add(user);
   console.log(`New user with username "${username}" created.`.blue);
   return response;
}

/**
 * Deletes user from database.
 * @param {apigen.IncomingMessage} req Server request.
 */
function deleteUser(req) {}

/**
 * Generate a user token.
 * @param {string} id
 */
function generateUserToken(id) {
   return jwt.sign({ id }, process.env.JWT_SECRET || "SOME_STRING", {
      expiresIn: "20d",
   });
}

module.exports = {
   addNewUser,
   deleteUser,
};
