const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { utils, ServerError } = require("../lib");
const { ERROR_TYPES, JWT_SECRET } = require("../constants");

require("colors");

/**
 * Adds a new user.
 * @param {apigen.Request} req Server request.
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
   /**@type {UserSession} */
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
 * @param {apigen.Request} req Server request.
 * @throws {apigen.ServerError}
 */
function deleteUser(req) {
   if (req.method !== "DELETE") {
      throw new ServerError(ERROR_TYPES.MALFORMED_REQUEST);
   }

   const users = db.getUsers();
   /**@type {User} */
   const user = req["user"];
   users.remove(user.id);
   console.log(`User with username ${user.username} deleted.`.yellow);
   return { success: true };
}

/**
 * Log in a user.
 * @param {apigen.Request} req Server Request
 * @throws {apigen.ServerError}
 */
function loginUser(req) {
   if (req.method !== "POST") {
      throw new ServerError(ERROR_TYPES.MALFORMED_REQUEST);
   }
   const { username, email, password } = req.body;
   if (typeof username !== "string" && typeof email !== "string") {
      throw new ServerError(ERROR_TYPES.MALFORMED_REQUEST);
   }
   const users = db.getUsers();
   const user = users.find(
      (user) => user.username === username || user.emailAddress === email
   );
   if (!user) {
      throw new ServerError(ERROR_TYPES.NOT_FOUND, 404);
   }
   if (!bcrypt.compareSync(password, user.password)) {
      throw new ServerError(ERROR_TYPES.INVALID_PASSWORD, 401);
   }
   /** @type {UserSession} */
   const response = {
      username,
      token: generateUserToken(user.id),
   };
   console.log(`User "${username}" logged in.`.blue);
   return response;
}

/**
 * Returns the metrics of a user so far.
 * @param {apigen.Request} req
 * @throws {apigen.ServerError}
 */
function getUserStats(req) {
   if (req.method !== "GET") {
      throw new ServerError(ERROR_TYPES.MALFORMED_REQUEST);
   }
   /**@type {User} */
   const user = req["user"];
   let quizzesPlayed = user.quizzesPlayed;
   let stars = user.stars;
   let successRate = user.successRate;
   console.log(`GET /user/stats for "${user.username}"`);
   return {
      quizzesPlayed,
      stars,
      successRate,
   };
}

/**
 * Updates the metrics of a user.
 * @param {apigen.Request} req
 * @throws {apigen.ServerError}
 */
function updateStats(req) {
   if (req.method !== "PUT") {
      throw new ServerError(ERROR_TYPES.MALFORMED_REQUEST);
   }
   const { quizResult, starsEarned } = req.body;
   if (typeof quizResult !== "number" || typeof starsEarned !== "number") {
      throw new ServerError(ERROR_TYPES.MALFORMED_REQUEST);
   }
   /**@type {User} */
   const user = req["user"];
   user.quizzesPlayed += 1;
   user.successRate = (quizResult + user.successRate) / user.quizzesPlayed;
   user.stars += starsEarned;
   return { success: true };
}

/**
 * Generate a user token.
 * @param {string} id
 */
function generateUserToken(id) {
   return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: "20d",
   });
}

module.exports = {
   addNewUser,
   deleteUser,
   loginUser,
   getUserStats,
   updateStats,
};
